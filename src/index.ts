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

    abstract onValue(container: any, attribute: string, path: string, path_dict: any): void

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
                this.onValue(parent, attribute, this.toPath(this.current_path), path_dict);
            }
        }
    }
}

export class PathScanner extends StructScanner {

    constructor() {
        super()
    }

    public override onValue(container: any, attribute: string, path: string, path_dict: any): void {
        const current = container[attribute];
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

export class PathDictBuilder extends StructScanner {

    constructor() {
        super()
    }

    public override onValue(container: any, attribute: string, path: string, path_dict: any): void {
        const current = container[attribute];
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

    public override onValue(container: any, attribute: string, path: string, path_dict: any): void {
        const current = container[attribute];
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

    public override onValue(container: any, attribute: string, path: string, path_dict: any): void {
        const value = path_dict[path];
        if (value) {
            container[attribute] = value;
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

export class StructTransformer {

    private from_dict: any = {};
    private to_dict: any = {};

    constructor(from: any, to: any) {
        const from_scanner: PathScanner = new PathScanner();
        const to_scanner: PathDictBuilder = new PathDictBuilder();
        from_scanner.Scan(from, this.from_dict);
        to_scanner.Scan(to, this.to_dict);
    }

    public Transform(before: any, after: any): void {

        const value_collector: ValueCollecter = new ValueCollecter();
        const struct_renderer: StructRenderer = new StructRenderer();

        const relation: any = {};
        const values: any = {};

        value_collector.Scan(before, values);

        Object.keys(this.from_dict).forEach((key) => {
            const key_string: string = key.toString();
            const from: string = this.from_dict[key_string];
            const to: string[] = this.to_dict[key_string];
            if (from && to) {
                to.forEach((key) => {
                    relation[key] = values[from];
                })
            }
        });

        struct_renderer.Scan(after, relation);
    }

}