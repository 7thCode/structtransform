<div align="center">

<h1>StructTransform</h1>

Use a template to change the value of an object.

![GitHub package.json version](https://img.shields.io/github/package-json/v/7thcode/structtransform?color=deepgreen)
[![npm version](https://badge.fury.io/js/structtransform.svg)](https://badge.fury.io/js/structtransform)
![npm type definitions](https://img.shields.io/npm/types/structtransform)
![GitHub](https://img.shields.io/github/license/7thcode/structtransform)
[![7thCode](https://circleci.com/gh/7thCode/structtransform.svg?style=shield)]()
![node.js.yml](https://github.com/7thCode/structtransform/actions/workflows/node.js.yml/badge.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/7thcode/structtransform)

 [README]　[DEMO]　[in detail]

</div>

***
# Motivation
I have to migrate... Do you change the shape of so many objects?
# Features
Transform an object using two templates, pre-transform and post-transform.
The two templates are a mechanism to recognize each other's location by "key".
# Installation
```bash
npm install structtransform
```
No modules depend on it.
# Usage
## StructTransformer
#### Transform the structure.

First, the object before transformation is defined as the original template.

Next, an object representing the transformed structure is prepared as a post-processing template.

By applying inset_data that holds the data to the target data, the value of the target data is converted from the original template to the structure of the post-process template using the value as a key.

Replace the structure of the from template with the structure of the to template.
The from and to templates apply the same values to the same key locations.
Note that the value must be of built-in type.

#### Example

```js
const original_template: any = [{a: "Key1"}, {b: "Key2"}, {c: ["Key3", "Key4"]}];
const post_processing_template: any = {x1: "Key1", x2: {y1: "Key2", y2: "Key2", y3: {z1: "Key3", z2: "Key4"}}};

const transformer: StructTransformer = new StructTransformer(before_template, after_template);

const inset_data = [{a: "Data1"}, {b: "Data2"}, {c: ["Data3", "Data4"]}]
const target_and_result = {x1: "", x2: {y1: "", y2: "", y3: {z1: "", z2: ""}}};

transformer.Transform(inset_data, target_and_result);
```

```js
console.log(target_and_result);
```

```
    {
      x1: 'Data1',
      x2: { y1: 'Data2', y2: 'Data2', y3: { z1: 'Data3', z2: 'Data4' } }
    }
```

The target object may be part of the object.

#### Example

```js
const original_template: any = [{a: "Key1"}, {b: "Key2"}, {c: ["Key3", "Key4"]}];
const post_processing_template: any = {x1: "Key1", x2: {y1: "Key2", y2: "Key2", y3: {z1: "Key3", z2: "Key4"}}};


// works equally well for container elements.
const transformer: StructTransformer = new StructTransformer(before_template, after_template);

const inset_data = [{a: "Data1"}, {b: "Data2"}, {c: ["Data3", "Data4"]}]
const target_and_result = [
    {x1: "", x2: {y1: "", y2: "", y3: {z1: "", z2: ""}}},
    {x1: "", x2: {y1: "", y2: "", y3: {z1: "", z2: ""}}},
    {x1: "", x2: {y1: "", y2: "", y3: {z1: "", z2: ""}}},
    {x1: "", x2: {y1: "", y2: "", y3: {z1: "", z2: ""}}},
];

transformer.Transform(inset_data, target_and_result[2]);
```

```js
console.log(target_and_result);
```

```
[
    {x1: '',x2: {y1: '', y2: '', y3: {z1: "", z2: ""}}},
    {x1: '',x2: {y1: '', y2: '', y3: {z1: "", z2: ""}}},
    {x1: 'Data1', x2: {y1: 'Data2', y2: 'Data2', y3: {z1: "Data3", z2: "Data4"}}},
    {x1: '',x2: {y1: '', y2: '', y3: {z1: "", z2: ""}}}
]
```

###


The various classes that make up StructTransformer can also be used alone.
Such classes include:

### PathScanner

Returns an enumeration of all object paths keyed by a value. If the same value is duplicated, only one path of the object whose value was found last is returned.

#### Example

```js
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
```

```js
console.log(result);
```

```
{
    Unique1: '/a/a1',
    Unique2: '/b/b1/b11/b111',
    Unique3: '/b/b1/b12/b121/0',
    Unique4: '/b/b1/b12/b121/1',
    Unique5: '/b/b1/b12/b121/2/b1211'
}
```

### PathDictBuilder

Returns an enumeration of all object paths keyed by a value. If the same value is duplicated, the path is added as an array element.

#### Example

```js
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
expect(result).toStrictEqual({Duplicate1: ["/a/a1", "/b/b1/b11/b111", "/b/b1/b12/b121/2/b1211"], Duplicate2: ["/b/b1/b12/b121/0", "/b/b1/b12/b121/1"]});
```

```js
console.log(result);
```

```
{
    Duplicate1: ['/a/a1', '/b/b1/b11/b111', '/b/b1/b12/b121/2/b1211'],
    Duplicate2: ['/b/b1/b12/b121/0', '/b/b1/b12/b121/1']
}
```

### ValueCollecter

Returns an object whose key is a path and whose value is the value of that path.

#### Example

```js

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
```

```js
console.log(result);
```

```
{
    '/a/a1': 'Value1',
    '/b/b1/b11/b111': 'Value2',
    '/b/b1/b12/b121/0': 'Value3',
    '/b/b1/b12/b121/1': 'Value4',
    '/b/b1/b12/b121/2/b1211': 'Value5'
}
```

### StructRenderer

Change the value of the target path of the target object by using [Object whose value is the path as the key] such as the result of "ValueCollecter".

#### Example

```js

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
```

```js
console.log(target_and_result);
```

```
{
    a: {a1: "Original1"},
    b: {
        b1: {
            b11: {b111: "Original2"},
            b12: {b121: ["Original3", "Original4", {b1211: "Original5"}]}
        }
    }
}
```
# Note
See demo.md for unclear cases.
# Author
info@seventh-code.com
# License
"structtransform" is under [MIT license](https://en.wikipedia.org/wiki/MIT_License).

[README]: README.md
[DEMO]: docs/demo.md
[in detail]: docs/detail.md
