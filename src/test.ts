/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {StructScanner, StructTransformer} from "./index";

describe('StructTransformer', () => {

    it('Scanner', () => {
        const transformer = new StructTransformer({}, {});
        expect(transformer.Transform({})).toBe(true);

        const scanner = new StructScanner();
        let dict: { path: string, value: any }[] = [];
//        scanner.Scan({x: {a: "1"}, y: {b: "2"}}, dict);
//        expect(dict).toStrictEqual([{path: "/x/a", value: "1"}, {path: "/y/b", value: "2"}]);

        dict = [];

        const o = {
            a: {a1: "x1"},
            b: {
                b1: {
                    b11: {b111: "x2"},
                    b12: {b121: ["x3","x4",{b1211:"x5"}]}
                }
            }
        }

        scanner.Scan(o, dict);
        expect(dict).toStrictEqual([{path: "/a/a1", value: "x1"}, {path: "/b/b1/b11/b111", value: "x2"}, {path: "/b/b1/b12/b121/0", value: "x3"}, {path: "/b/b1/b12/b121/1", value: "x4"}, {path: "/b/b1/b12/b121/2/b1211", value: "x5"}]);

        dict  = [];
        scanner.Scan([1,2,3], dict);
        expect(dict).toStrictEqual([{path:"/0",value:1},{path:"/1",value:2},{path:"/2",value:3}]);

        dict  = [];
        scanner.Scan([{a:1},{b:2},{c:3}], dict);
        expect(dict).toStrictEqual([{path:"/0/a",value:1},{path:"/1/b",value:2},{path:"/2/c",value:3}]);


        /*
                expect(scanner.Scan({},[])).toBe(true);
                expect(scanner.Scan([],[])).toBe(true);
                expect(scanner.Scan("",[])).toBe(false);
                expect(scanner.Scan( 0,[])).toBe(false);
                expect(scanner.Scan( false,[])).toBe(false);
                expect(scanner.Scan( null,[])).toBe(false);
                expect(scanner.Scan( NaN,[])).toBe(false);
                expect(scanner.Scan( undefined,[])).toBe(false);
        */


    });

});