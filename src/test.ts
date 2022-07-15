/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {UniqueKeyScanner, ManyKeyScanner, StructRenderer1, StructTransformer} from "./index";

describe('StructTransformer', () => {

    it('UniqueKeyScanner', () => {

        const unique_scanner = new UniqueKeyScanner();
        let dict: any = {};

        const o = {
            a: {a1: "x1"},
            b: {
                b1: {
                    b11: {b111: "x2"},
                    b12: {b121: ["x3", "x4", {b1211: "x5"}]}
                }
            }
        }

        unique_scanner.Scan(o, dict);
        expect(dict).toStrictEqual({x1: "/a/a1", x2: "/b/b1/b11/b111", x3: "/b/b1/b12/b121/0", x4: "/b/b1/b12/b121/1", x5: "/b/b1/b12/b121/2/b1211"});

        dict = {};
        unique_scanner.Scan([1, 2, 3], dict);
        expect(dict).toStrictEqual({1: "/0", 2: "/1", 3: "/2"});

        dict = {};
        unique_scanner.Scan([{a: 1}, {b: 2}, {c: 3}], dict);
        expect(dict).toStrictEqual({1: "/0/a", 2: "/1/b", 3: "/2/c"});

        dict = {};
        unique_scanner.Scan([{a: 1}, {a: 1}, {c: 1}], dict);
        expect(dict).toStrictEqual({1: "/2/c"});

        dict = {};
        const x = {a: {}, b: [], c: "", d: 0, e: false, f: null, g: NaN, h: undefined}

        unique_scanner.Scan(x, dict);
        expect(dict).toStrictEqual({0: "/d", NaN: "/g"});


        unique_scanner.Scan({}, []);
        unique_scanner.Scan([], []);
        unique_scanner.Scan("", []);
        unique_scanner.Scan(0, []);
        unique_scanner.Scan(false, []);
        unique_scanner.Scan(null, []);
        unique_scanner.Scan(NaN, []);
        unique_scanner.Scan(undefined, []);

    });

    it('ManyKeyScanner', () => {


        const many_key_scanner = new ManyKeyScanner();
        let dict: any = {};

        const o = {
            a: {a1: "x1"},
            b: {
                b1: {
                    b11: {b111: "x2"},
                    b12: {b121: ["x3", "x4", {b1211: "x5"}]}
                }
            }
        }

        many_key_scanner.Scan(o, dict);
        expect(dict).toStrictEqual({x1: ["/a/a1"], x2: ["/b/b1/b11/b111"], x3: ["/b/b1/b12/b121/0"], x4: ["/b/b1/b12/b121/1"], x5: ["/b/b1/b12/b121/2/b1211"]});

        dict = {};
        many_key_scanner.Scan([1, 2, 3], dict);
        expect(dict).toStrictEqual({1: ["/0"], 2: ["/1"], 3: ["/2"]});

        dict = {};
        many_key_scanner.Scan([{a: 1}, {b: 2}, {c: 3}], dict);
        expect(dict).toStrictEqual({1: ["/0/a"], 2: ["/1/b"], 3: ["/2/c"]});

        dict = {};
        many_key_scanner.Scan([{a: 1}, {a: 1}, {c: 1}], dict);
        expect(dict).toStrictEqual({1: ["/0/a","/1/a","/2/c"]});

        dict = {};
        const x = {a: {}, b: [], c: "", d: 0, e: false, f: null, g: NaN, h: undefined}

        many_key_scanner.Scan(x, dict);
        expect(dict).toStrictEqual({0: ["/d"], NaN: ["/g"]});


        many_key_scanner.Scan({}, []);
        many_key_scanner.Scan([], []);
        many_key_scanner.Scan("", []);
        many_key_scanner.Scan(0, []);
        many_key_scanner.Scan(false, []);
        many_key_scanner.Scan(null, []);
        many_key_scanner.Scan(NaN, []);
        many_key_scanner.Scan(undefined, []);

    });

    it('StructRenderer', () => {

        const struct_renderer = new StructRenderer1();
        let dict: any = {};

        const i = {
            a: {a1: "x1"},
            b: {
                b1: {
                    b11: {b111: "x2"},
                    b12: {b121: ["x3", "x4", {b1211: "x5"}]}
                }
            }
        }

        const o = {
            a: {a1: "a"},
            b: {
                b1: {
                    b11: {b111: "a"},
                    b12: {b121: ["a", "a", {b1211: "a"}]}
                }
            }
        }

        struct_renderer.Render(i, dict);
        expect(i).toStrictEqual(o);


    });




    it('Transformer', () => {
        const transformer = new StructTransformer([{a: "key1"}, {b: "key2"}, {c: ["key3", "key4"]}], {x1: "key1", x2: {y1: "key2", y2: "key2", y3: {z1: "key3", z2: "key4"}}});
        expect(transformer.Transform({})).toBe(true);
    });
});