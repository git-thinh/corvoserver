import Store from "../store.js";
import CorvoLinkedList from "../corvo_linked_list.js";
import CorvoNode from "../corvo_node.js";
import MemoryTracker from "../memory_tracker";

describe("Hash",  () => {
  it("uses hget to get a value from an existing hash using a field", () => {
    const testStore = new Store();
    const key = 'key';
    const myField = 'myField';
    const value = 'myValue';

    const node = new CorvoNode(key, { myField: value });
    testStore.mainHash[key] = node;
    testStore.mainList.append(node);
    // testStore.hset(key, field, value);

    expect(testStore.hget(key, myField)).toBe(value);
  });

  it("uses hsetnx method on a non-existent key and returns 1", () => {
    const key = "key1"
    const field = "field1";
    const value = "value1";
    const testStore = new Store();

    const returnVal = testStore.hsetnx(key, field, value);
    expect(returnVal).toBe(1);
    expect(testStore.mainHash[key].val[field]).toBe(value);
  });

  it("uses hsetnx throws error when called on a key that holds a non-hash value", () => {
    const key = "key1"
    const field = "field1";
    const value = "value1";
    const testStore = new Store();
    testStore.setString(key, value);
    expect(() => { testStore.hsetnx(key, field, value) }).toThrow(new Error("StoreError: value at key not a hash."));
  });

  it("uses hsetnx method on a already existing key but non-existent field, returns 1", () => {
    const key = "key1"
    const field1 = "field1";
    const value1 = "value1";
    const field2 = "field2";
    const value2 = "value2";
    const testStore = new Store();

    testStore.hsetnx(key, field1, value1);
    const returnVal = testStore.hsetnx(key, field2, value2);
    expect(returnVal).toBe(1);
    expect(testStore.mainHash[key].val[field1]).toBe(value1);
    expect(testStore.mainHash[key].val[field2]).toBe(value2);
  });

  it("uses hsetnx method on a already existing key and already existent field, returns 0 and the field's value is unchanged", () => {
    const key = "key1"
    const field1 = "field1";
    const value1 = "value1";
    const value2 = "value2";
    const testStore = new Store();

    testStore.hsetnx(key, field1, value1);
    const returnVal = testStore.hsetnx(key, field1, value2);
    expect(returnVal).toBe(0);
    expect(testStore.mainHash[key].val[field1]).toBe(value1);
  });
})