/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

export abstract class StructScanner {

    private current_path: string[] = [];

    constructor() {
    }

    protected static isValue(value: unknown): boolean {
        return ((value !== null) && (typeof value !== 'undefined'));
    }

    protected static isContainer(value: unknown): boolean {
        return ((value !== null) && (typeof value === 'object'));
    }

    abstract onValue(current: any, parent: any, attribute: string, path: string, path_dict: any): void

    abstract toPath(value: string[]): any

    public Scan(s: any, path_dict: any): void {
        this.current_path = [];
        this._Scan(s, {}, "", path_dict);
    }

    protected _Scan(current: any, parent: any, attribute: string, path_dict: any): void {
        if (StructScanner.isValue(current)) {
            if (StructScanner.isContainer(current)) {
                Object.keys(current).forEach((attr) => {
                    this.current_path.push(attr);
                    this._Scan(current[attr], current, attr, path_dict);
                    this.current_path.pop();
                });
            } else {
                this.onValue(current, parent, attribute, this.toPath(this.current_path), path_dict);
            }
        }
    }
}

export class UniqueKeyScanner extends StructScanner {

    constructor() {
        super()
    }

    public override onValue(current: any, parent: any, attribute: string, path: string, path_dict: any): void {
        switch (current) { // filter special types.
            case "":
            case false:
            case null:
            case undefined:
                break;
            default:
                const key_string: string = current.toString();
                path_dict[key_string] = path;
                break;
        }
    }

    public override toPath(value: string[]): any {
        let result = "";
        value.forEach((s) => {
            result += "/" + s;
        })
        return result;
    }
}

export class ManyKeyScanner extends StructScanner {

    constructor() {
        super()
    }

    public override onValue(current: any, parent: any, attribute: string, path: string, path_dict: any): void {
        switch (current) { // filter special types.
            case "":
            case false:
            case null:
            case undefined:
                break;
            default:
                const key_string: string = current.toString();
                if (!(key_string in path_dict)) {
                    path_dict[key_string] = [];
                }
                path_dict[key_string].push(path);
                break;
        }
    }

    public override toPath(value: string[]): any {
        let result = "";
        value.forEach((s) => {
            result += "/" + s;
        })
        return result;
    }

}

export class ValueCollecter extends StructScanner {

    constructor() {
        super()
    }

    public override onValue(current: any, parent: any, attribute: string, path: string, path_dict: any): void {
        switch (current) { // filter special types.
            case "":
            case false:
            case null:
            case undefined:
                break;
            default:
                const key_string: string = current.toString();
                path_dict[path] = key_string;
                break;
        }
    }

    public override toPath(value: string[]): any {
        let result = "";
        value.forEach((s) => {
            result += "/" + s;
        })
        return result;
    }
}

export class StructRenderer extends StructScanner {

    constructor() {
        super()
    }

    public override onValue(current: any, parent: any, attribute: string, path: string, path_dict: any): void {
        parent[attribute] = "a";
    }

    public override toPath(value: string[]): any {
        let result = "";
        value.forEach((s) => {
            result += "/" + s;
        })
        return result;
    }

}

export class StructTransformer {

    private output: any = {};

    private from_dict: any = {};
    private to_dict: any = {};

    private relation: any = {};

    constructor(from: any, to: any) {

        this.output = to;

        const from_scanner = new UniqueKeyScanner();
        const to_scanner = new ManyKeyScanner();
        from_scanner.Scan(from, this.from_dict);
        to_scanner.Scan(to, this.to_dict);

        Object.keys(this.from_dict).forEach((key) => {
            const key_string: string = key.toString();
            const from: string = this.from_dict[key_string];
            const to: string[] = this.to_dict[key_string];
            if (from && to) {
                to.forEach((key) => {
                    this.relation[key] = from;
                })
            }
        });
    }

    public Transform(before: any): boolean {
        let result: boolean;

        const value_collecter = new ValueCollecter();
        const struct_renderer = new StructRenderer();

        const values: any = {};
        value_collecter.Scan(before, values);

        Object.keys(this.relation).forEach((key) => {
            this.relation[key] = values[this.relation[key]];
        })

        struct_renderer.Scan(this.output, this.relation);

        result = true;
        return result;
    }

}