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
        let dict: { path: string[], value: any }[] = [];
//        scanner.Scan({x: {a: "1"}, y: {b: "2"}}, dict);
//        expect(dict).toStrictEqual([{path: "/x/a", value: "1"}, {path: "/y/b", value: "2"}]);

        dict = [];

        const o = {
            a: {a1: "1"},
            b: {
                b1: {
                    b11: {b111: "2"},
                    b12: {b121: "3"}
                }
            }
        }
        scanner.Scan(o, dict);
  //      expect(dict).toStrictEqual([{path: "/x/a", value: "1"}, {path: "/y/b/x/a", value: "1"}, {path: "/y/b/y/b", value: "2"}]);

   //           dict  = [];
              scanner.Scan([1,2,3], dict);

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