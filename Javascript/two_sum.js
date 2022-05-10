/**
 * Question from leetcode
 * Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
 * You may assume that each input would have exactly one solution, and you may not use the same element twice.
 * You can return the answer in any order.
 */

/**Class ver
class twoSum_class {
    constructor(array, target){
        this.nums = array;
        this.target = target;
    }
}*/

//Object for two_sum
function two_sum_obj (array, target){
    this.nums = array;
    this.target = target;
};

//Javascript has no real way to compare to arrays/objects directly, might be easier to just compare string value
function assert_equal(expected, result){
    let compareExpected = expected.toString();
    let compareResult = result.toString();
    if (compareExpected == compareResult){
        return true;
    }
    return false;
}

//one pass with hashmap using complement. If the complement exists, return current i and nums[i]
//If non are detected, we store the value of num[i] as a key and its index as value (key,value
//First pass: 9 - 2 = 7, map.has(7) is false, map.set(2,0) where 2 is the value and 0 is index with respect to nums
//Second pass: 9 - 7 = 2, map.has(2) is true, with the key of 2, the value is 0 (also the index), and we return it
//with the current index i
function twosum(two_sum_obj){
    let map = new Map();
    for (var i = 0; i < two_sum_obj.nums.length; i++){
        let complement = two_sum_obj.target - two_sum_obj.nums[i];
        if (map.has(complement)){
            return [map.get(complement),i];
        }
        map.set(two_sum_obj.nums[i], i);
    }
}

let test1 = [0,1]
const obj1 = new two_sum_obj([2,7,11,15], 9);
console.log(assert_equal(twosum(obj1), test1));

let test2 = [3,5]
const obj2 = new two_sum_obj([5,7,9,13,15,17], 30);
console.log(assert_equal(twosum(obj2), test2));