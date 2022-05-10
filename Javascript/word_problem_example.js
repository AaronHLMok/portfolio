//Aaron Mok, May 9th, 2022

/**Stay calm and do your best!*/

/**Problem
 * [
{ reviewer: 'mrodrigue', reviewee: 'sachenbach', result: 'agree' },
{ reviewer: 'mrodrigue', reviewee: 'rfeynmann', result: 'disagree' },
{ reviewer: 'sachenbach', reviewee: 'mrodrigue', result: 'agree' },...
  reviewer: 'mrodrigue,  reviewee: 'someonelse'];

 *Suppose product is on server, radiology. Docotrs will read patient image and generate report
 ->Part of process is to select part of report for peer review. Data will grow. Names are doctors, they will either agree or disagree
 ->Write a function to find out which pair of doctors agree with eachother 'most of the time'
 ->Largest amount of agreements
 */

 /**Breakdown
  * How do I want to do this? Our end goal is to find out 'which pair of doctors agree with eachother the most'
  * 1) How do I identify two pairs of doctors? Do I care about reviewer? Do I care about Reviewee? Do I care about what the result is?
  * ->We do not care about 'disagree' results
  * 2) If we manage to find a pair, what should we do? If the pair exists, what if it doesn't? How can we identify a pair?
  * 3) What data structure should I use? Stick with this data structure and don't jump around. Do not care about small details just yet
  * 4) What are my steps in accomplishing the tasks?
  * -> We read the data, then what?
  * -> What do we do with the data?
  * -> How should we manipulate the data?
  */

/**Steps
 * 1) Traverse Data. We know we want to store a pair of doctors
 * ->Since we only care about 'agree' we can disregard disagree entries and focus soely on the pair
 * ->How should we store our information? A pair object key and value which can be incremented
 * 2) What do we do if the pair exists or does not exist? We should check pairs and create them as needed
 * 3) After we run through the data, pick the pair with the largest count
 * 
 */

function in_data(data){
    var map = new Map();

    for (var i = 0; i < data.length; i++){
        if (data[i].result == 'agree'){
            if(check_pair(map, data[i])){
                increment_count(map, data[i]);
            } else {
                let key = create_pair(data[i]);
                map.set(key, 1);
            }
        }
    }

    console.log(map);

    return select_largest_count();
}

function select_largest_count(){

}

function increment_count(map, data){
    console.log('hello');
    for (const [key] of map.entries()){
        if(key.reviewer === data.reviewer && key.reviewee === data.reviewee){
            map.set(key, map.get(key) + 1);
        }
    }
}

//map.has is by refference, so we gotta look up keys individually if they are 'paired' 
function check_pair(map, data){
    for (const [key] of map.entries()){
        if(key.reviewer === data.reviewer && key.reviewee === data.reviewee){
            return true;
        }
    }
}

function create_pair(data){
    var person = new Object();
    person.reviewer = data.reviewer;
    person.reviewee = data.reviewee;
    return person;
}

var data = [
    { reviewer: 'mrodrigue', reviewee: 'sachenbach', result: 'agree' },
    { reviewer: 'mrodrigue', reviewee: 'rfeynmann', result: 'disagree' },
    { reviewer: 'sachenbach', reviewee: 'mrodrigue', result: 'agree' },
    { reviewer: 'mrodrigue', reviewee: 'sachenbach', result: 'agree' }];

in_data(data);