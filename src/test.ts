/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {PathScanner, PathDictBuilder, StructRenderer, StructTransformer, ValueCollecter} from "./index";

describe('StructTransformer', () => {

    it('PathScanner', () => {

        const unique_scanner = new PathScanner();
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

    it('PathDictBuilder', () => {

        const many_key_scanner = new PathDictBuilder();
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
        expect(dict).toStrictEqual({1: ["/0/a", "/1/a", "/2/c"]});

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

    it('ValueCollecter', () => {

        const value_collecter = new ValueCollecter();
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

        value_collecter.Scan(o, dict);
        expect(dict).toStrictEqual({"/a/a1": "x1", "/b/b1/b11/b111": "x2", "/b/b1/b12/b121/0": "x3", "/b/b1/b12/b121/1": "x4", "/b/b1/b12/b121/2/b1211": "x5"});

        value_collecter.Scan({}, []);
        value_collecter.Scan([], []);
        value_collecter.Scan("", []);
        value_collecter.Scan(0, []);
        value_collecter.Scan(false, []);
        value_collecter.Scan(null, []);
        value_collecter.Scan(NaN, []);
        value_collecter.Scan(undefined, []);
    });

    it('StructRenderer', () => {

        const struct_renderer = new StructRenderer();
        let dict: any = {"/a/a1": "updated1", "/b/b1/b12/b121/1": "updated4"};

        const i = {
            a: {a1: "original1"},
            b: {
                b1: {
                    b11: {b111: "original2"},
                    b12: {b121: ["original3", "original4", {b1211: "original5"}]}
                }
            }
        }

        const o = {
            a: {a1: "updated1"},
            b: {
                b1: {
                    b11: {b111: "original2"},
                    b12: {b121: ["original3", "updated4", {b1211: "original5"}]}
                }
            }
        }

        struct_renderer.Scan(i, dict);
        expect(i).toStrictEqual(o);

        struct_renderer.Scan({}, []);
        struct_renderer.Scan([], []);
        struct_renderer.Scan("", []);
        struct_renderer.Scan(0, []);
        struct_renderer.Scan(false, []);
        struct_renderer.Scan(null, []);
        struct_renderer.Scan(NaN, []);
        struct_renderer.Scan(undefined, []);
    });

    it('Transformer', () => {

        const before_template: any = [{a: "key1"}, {b: "key2"}, {c: ["key3", "key4"]}];
        const after_template: any = {x1: "key1", x2: {y1: "key2", y2: "key2", y3: {z1: "key3", z2: "key4"}}};

        const transformer: StructTransformer = new StructTransformer(before_template, after_template);

        const data = [{a: "Data1"}, {b: "Data2"}, {c: ["Data3", "Data4"]}]
        const before = {x1: "dummy", x2: {y1: "dummy", y2: "dummy", y3: {z1: "dummy", z2: "dummy"}}};
        const after = {x1: "Data1", x2: {y1: "Data2", y2: "Data2", y3: {z1: "Data3", z2: "Data4"}}};

        transformer.Transform(data, before);
        expect(before).toStrictEqual(after);

        const before_array = [
            {x1: "dummy", x2: {y1: "dummy", y2: "dummy", y3: {z1: "dummy", z2: "dummy"}}},
            {x1: "dummy", x2: {y1: "dummy", y2: "dummy", y3: {z1: "dummy", z2: "dummy"}}},
            {x1: "dummy", x2: {y1: "dummy", y2: "dummy", y3: {z1: "dummy", z2: "dummy"}}},
            {x1: "dummy", x2: {y1: "dummy", y2: "dummy", y3: {z1: "dummy", z2: "dummy"}}},
        ];

        const after_array = [
            {x1: "dummy", x2: {y1: "dummy", y2: "dummy", y3: {z1: "dummy", z2: "dummy"}}},
            {x1: "dummy", x2: {y1: "dummy", y2: "dummy", y3: {z1: "dummy", z2: "dummy"}}},
            {x1: "Data1", x2: {y1: "Data2", y2: "Data2", y3: {z1: "Data3", z2: "Data4"}}},
            {x1: "dummy", x2: {y1: "dummy", y2: "dummy", y3: {z1: "dummy", z2: "dummy"}}},
        ];

        transformer.Transform(data, before_array[2]);
        expect(before_array).toStrictEqual(after_array);

    });
});