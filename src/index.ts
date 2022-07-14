/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

export class StructScanner {

    private current_path: string[] = [];

    constructor() {
    }

    private static isValue(value: unknown): boolean {
        return ((value !== null) && (typeof value !== 'undefined'));
    }

    private static isContainer(value: unknown): boolean {
        return ((value !== null) && (typeof value === 'object'));
    }

    public Scan(s: any, dict: { path: string[], value: any }[]): boolean {
        this.current_path = [];
        return this._Scan(s, dict);
    }

    private _Scan(s: any, dict: { path: string[], value: any }[]): boolean {
        let result = true;
        if (StructScanner.isValue(s)) {
            if (StructScanner.isContainer(s)) {
                const attrs = Object.keys(s);
                for (let index = 0; index < attrs.length; index++) {
                    let attr = attrs[index];
                    this.current_path.push(attr);
                    

                    if (this._Scan(s[attr], dict)) {
                        if (Array.isArray(s)) {
                            break;
                        } else {
                            this.current_path.pop();
                        }
                    } else {
                        if (Array.isArray(s)) {
                            this.current_path.pop();
                        } else {
                            break;
                        }
                    }
                }
            } else {


                console.log(this.current_path + " : " + s);


                dict.push({path: this.current_path, value: s});

                this.current_path.pop();
                result = false;
            }
        } else {
            result = false;
        }
        return result;
    }

}

export class StructTransformer {

    private from: any = null;
    private to: any = null;

    constructor(from: any, to: any) {

        const scanner = new StructScanner();

        this.from = from;
        this.to = to;
    }

    public Transform(before: any): boolean {
        let result: boolean;
        result = true;
        return result;
    }

}