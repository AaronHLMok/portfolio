//Given a string s, return the longest palindromic substring in s.

//idea: First how to identify palindromes in a substring, then compare which one is the longest
//Palindromes generally have a 'center', and by revolving around this while scanning left to right of a string
//We can find all palindromes in a string if it exists. We just need to keep track of whichone is the longest

//important note, it might be useful to floor stuff with js
function longest_pali_substring(s){
    if(s == null || s.length < 1){
        return false;
    }
    
    //note here start and end are positions/index of a string and not total length of them
    var start = 0, end = 0;

    var longest_substring = "";
    for (var i = 0; i < s.length; i++){
        var isOdd = true;
        var length_odd = partition_around_center(s, i, i);
        var length_even = partition_around_center(s, i, i + 1);
        var len = Math.max(length_odd, length_even);
        
        if (length_even == len){
            isOdd = false;
        }

        if (len > end - start) {
            if (isOdd){
                start = i - Math.floor((len - 1) / 2);
                end = i + Math.floor(len / 2);
            } else {
                start = i - len / 2 + 1
                end = i + len / 2
            }
        }
    }
    return s.substring(start, end + 1);
}

function partition_around_center(s, left, right){
    while (left >= 0 && right < s.length && s[left] == s[right]){
        left--;
        right++;
    }

    return right - left - 1;
}

//cases: No palindrome and yes palindrome
var test1 = "abbd";
//var test2 = "aabbaa";
//var test3 = "aabbcbbaa"

console.log(longest_pali_substring(test1));
//console.log(longest_pali_substring(test2));
//console.log(longest_pali_substring(test3));