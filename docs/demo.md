| [README] | [DEMO] | [in detail] |
|----------|--------|-------------|

```ts
describe('StructTransformer', () => {

    it('PathScanner', () => {

        const unique_scanner = new PathScanner();
        let result: any = {};

        const target = {
            a: {a1: "Unique1"},
            b: {
                b1: {
                    b11: {b111: "Unique2"},
                    b12: {b121: ["Unique3", "Unique4", {b1211: "Unique5"}]}
                }
            }
        }

        unique_scanner.Scan(target, result);
        expect(result).toStrictEqual({Unique1: "/a/a1", Unique2: "/b/b1/b11/b111", Unique3: "/b/b1/b12/b121/0", Unique4: "/b/b1/b12/b121/1", Unique5: "/b/b1/b12/b121/2/b1211"});
        // console.log(dict);

        result = {};
        unique_scanner.Scan([1, 2, 3], result);
        expect(result).toStrictEqual({1: "/0", 2: "/1", 3: "/2"});

        result = {};
        unique_scanner.Scan([{a: 1}, {b: 2}, {c: 3}], result);
        expect(result).toStrictEqual({1: "/0/a", 2: "/1/b", 3: "/2/c"});

        result = {};
        unique_scanner.Scan([{a: 1}, {a: 1}, {c: 1}], result);
        expect(result).toStrictEqual({1: "/2/c"});

        result = {};
        const x = {a: {}, b: [], c: "", d: 0, e: false, f: null, g: NaN, h: undefined}

        unique_scanner.Scan(x, result);
        expect(result).toStrictEqual({0: "/d", NaN: "/g"});

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
        let result: any = {};

        const target = {
            a: {a1: "Duplicate1"},
            b: {
                b1: {
                    b11: {b111: "Duplicate1"},
                    b12: {b121: ["Duplicate2", "Duplicate2", {b1211: "Duplicate1"}]}
                }
            }
        }

        many_key_scanner.Scan(target, result);
        expect(result).toStrictEqual({Duplicate1: ["/a/a1","/b/b1/b11/b111","/b/b1/b12/b121/2/b1211"], Duplicate2: ["/b/b1/b12/b121/0","/b/b1/b12/b121/1"]});

        result = {};
        many_key_scanner.Scan([1, 2, 3], result);
        expect(result).toStrictEqual({1: ["/0"], 2: ["/1"], 3: ["/2"]});

        result = {};
        many_key_scanner.Scan([{a: 1}, {b: 2}, {c: 3}], result);
        expect(result).toStrictEqual({1: ["/0/a"], 2: ["/1/b"], 3: ["/2/c"]});

        result = {};
        many_key_scanner.Scan([{a: 1}, {a: 1}, {c: 1}], result);
        expect(result).toStrictEqual({1: ["/0/a", "/1/a", "/2/c"]});

        result = {};
        const x = {a: {}, b: [], c: "", d: 0, e: false, f: null, g: NaN, h: undefined}

        many_key_scanner.Scan(x, result);
        expect(result).toStrictEqual({0: ["/d"], NaN: ["/g"]});

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
        let result: any = {};

        const target = {
            a: {a1: "Value1"},
            b: {
                b1: {
                    b11: {b111: "Value2"},
                    b12: {b121: ["Value3", "Value4", {b1211: "Value5"}]}
                }
            }
        }

        value_collecter.Scan(target, result);
        expect(result).toStrictEqual({"/a/a1": "Value1", "/b/b1/b11/b111": "Value2", "/b/b1/b12/b121/0": "Value3", "/b/b1/b12/b121/1": "Value4", "/b/b1/b12/b121/2/b1211": "Value5"});

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
        let dictionary: any = {"/a/a1": "Updated1", "/b/b1/b12/b121/1": "Updated4"};

        const target_and_result = {
            a: {a1: "Original1"},
            b: {
                b1: {
                    b11: {b111: "Original2"},
                    b12: {b121: ["Original3", "Original4", {b1211: "Original5"}]}
                }
            }
        }

        struct_renderer.Scan(target_and_result, dictionary);
        expect(target_and_result).toStrictEqual({a: {a1: "Updated1"}, b: {b1: {b11: {b111: "Original2"}, b12: {b121: ["Original3", "Updated4", {b1211: "Original5"}]}}}});

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

        const before_template: any = [{a: "Key1"}, {b: "Key2"}, {c: ["Key3", "Key4"]}];
        const after_template: any = {x1: "Key1", x2: {y1: "Key2", y2: "Key2", y3: {z1: "Key3", z2: "Key4"}}};

        const transformer: StructTransformer = new StructTransformer(before_template, after_template);

        const data = [{a: "Data1"}, {b: "Data2"}, {c: ["Data3", "Data4"]}]
        const before = {x1: "Original1", x2: {y1: "Original2", y2: "Original3", y3: {z1: "Original4", z2: "Original5"}}};

        transformer.Transform(data, before);

        const after = {x1: "Data1", x2: {y1: "Data2", y2: "Data2", y3: {z1: "Data3", z2: "Data4"}}};

        expect(before).toStrictEqual(after);

        const before_array = [
            {x1: "Original1", x2: {y1: "Original2", y2: "Original3", y3: {z1: "Original4", z2: "Original5"}}},
            {x1: "Original1", x2: {y1: "Original2", y2: "Original3", y3: {z1: "Original4", z2: "Original5"}}},
            {x1: "Original1", x2: {y1: "Original2", y2: "Original3", y3: {z1: "Original4", z2: "Original5"}}},
            {x1: "Original1", x2: {y1: "Original2", y2: "Original3", y3: {z1: "Original4", z2: "Original5"}}},
        ];

        const after_array = [
            {x1: "Original1", x2: {y1: "Original2", y2: "Original3", y3: {z1: "Original4", z2: "Original5"}}},
            {x1: "Original1", x2: {y1: "Original2", y2: "Original3", y3: {z1: "Original4", z2: "Original5"}}},
            {x1: "Data1", x2: {y1: "Data2", y2: "Data2", y3: {z1: "Data3", z2: "Data4"}}},
            {x1: "Original1", x2: {y1: "Original2", y2: "Original3", y3: {z1: "Original4", z2: "Original5"}}},
        ];

        transformer.Transform(data, before_array[2]);
        expect(before_array).toStrictEqual(after_array);

    });
});
```

[README]: ../README.md
[DEMO]: demo.md
[in detail]: detail.md