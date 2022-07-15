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

    abstract onValue(key: any, path: any, path_dict: any): void

    abstract toPath(value: string[]): any

    public Scan(s: any, path_dict: any): void {
        this.current_path = [];
        this._Scan(s, path_dict);
    }

    protected _Scan(s: any, path_dict: any): void {
        if (StructScanner.isValue(s)) {
            if (StructScanner.isContainer(s)) {
                Object.keys(s).forEach((attr) => {
                    this.current_path.push(attr);
                    this._Scan(s[attr], path_dict);
                    this.current_path.pop();
                });
            } else {
                this.onValue(s, this.toPath(this.current_path), path_dict);
            }
        }
    }
}

export class UniqueKeyScanner extends StructScanner {

    constructor() {
        super()
    }

    public override onValue(key: any, path: any, path_dict: any): void {
        switch (key) { // filter special types.
            case "":
            case false:
            case null:
            case undefined:
                break;
            default:
                const key_string: string = key.toString();
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

    public override onValue(key: any, path: any, path_dict: any): void {
        switch (key) { // filter special types.
            case "":
            case false:
            case null:
            case undefined:
                break;
            default:
                const key_string: string = key.toString();
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

export abstract class StructRenderer {

    private current_path: string[] = [];

    constructor() {
    }

    protected static isValue(value: unknown): boolean {
        return ((value !== null) && (typeof value !== 'undefined'));
    }

    protected static isContainer(value: unknown): boolean {
        return ((value !== null) && (typeof value === 'object'));
    }

    abstract onValue(current: any, parent: any, attribute: any, path: any, path_dict: any): void

    abstract toPath(value: string[]): any

    public Render(s: any, path_dict: any): void {
        this.current_path = [];
        this._Render(s, {}, "", path_dict);
    }

    protected _Render(current: any, parent: any, attribute: any, path_dict: any): void {
        if (StructRenderer.isValue(current)) {
            if (StructRenderer.isContainer(current)) {
                Object.keys(current).forEach((attr) => {
                    this.current_path.push(attr);
                    this._Render(current[attr], current, attr, path_dict);
                    this.current_path.pop();
                });
            } else {
                this.onValue(current, parent, attribute, this.toPath(this.current_path), path_dict);
            }
        }
    }
}


export class StructRenderer1 extends StructRenderer {

    constructor() {
        super()
    }

    public override onValue(current: any, parent: any, attribute: any, path: any, path_dict: any): void {
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

    private from_dict: any = {};
    private to_dict: any = {};

    private relation: any = {};

    constructor(from: any, to: any) {

        const from_scanner = new UniqueKeyScanner();
        const to_scanner = new ManyKeyScanner();
        from_scanner.Scan(from, this.from_dict);
        to_scanner.Scan(to, this.to_dict);

        Object.keys(this.from_dict).forEach((key) => {
            const key_string: string = key.toString();
            const from: string = this.from_dict[key_string];
            const to: string[] = this.to_dict[key_string];
            if (from && to) {
                this.relation[from] = to;
            }
        });

        console.log(this.relation)
    }

    public Transform(before: any): boolean {
        let result: boolean;
        result = true;
        return result;
    }

}