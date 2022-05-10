//Given a string s, find the length of the longest substring without repeating characters.

//Using a hash map to identify when a repeating character occurs
//need to store initial character to compare, and longest substring to return

function longest_no_repeat_substring(s){
    var cat_string = "";
    var ret_string = "";
    var map = new Map();
    var index = 0;
    //If character is not in map, add it and concat string. If character is in map, exit loop, compare current
    //longest string, replace if length is lower than new one. Repeat and return when done

    //need to start the next round at the distance -1 of current ittereation (if duplicate seen)
    while(index <= s.length){
        if (cat_string.length > ret_string.length){
            ret_string = cat_string;
        }

        if (!map.has(s[index])){
            cat_string += s[index];
            map.set(s[index], index);
            index++;
        } else {
            map.clear();
            index -= cat_string.length - 1;
            cat_string = "";

        }
    }
    return ret_string;
}


var test1 = "abcabcbb";
console.log(longest_no_repeat_substring(test1));

