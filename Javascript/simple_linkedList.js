/**You are given two non-empty linked lists representing two non-negative integers. 
 * The digits are stored in reverse order, and each of their nodes contains a single digit. 
 * Add the two numbers and return the sum as a linked list.
 * You may assume the two numbers do not contain any leading zero, except the number 0 itself. */

//One idea: Add from head two numbers from the two lists, if 10 or greater then carry over

//Class for nodes
class Node {
    constructor(element){
        this.element = element;
        this.next = null;
    }
}

//Class for linked list, calling it creates empty list
class LinkedList {
    //need to add more stuff like insert/add and what not
    constructor(){
        this.head = null;
        this.size = 0;
    }

    add(element){
        var node = new Node(element);
        var current;
        //Case for empty list
        if(this.head == null){
            this.head = node;
        } else {
            //iterate to end of the list, current will store a 'pointer' node.
            current = this.head;
            while (current.next){
                current = current.next;
            }
            current.next = node;
        }
    }

    // prints the list items
    printList() {
        var curr = this.head;
        var str = "";
        while (curr) {
            str += curr.element + " ";
            curr = curr.next;
        }
        return str;
    }
}

function testing(){
    var l1 = new LinkedList();
    var l2 = new LinkedList();

    l1.add(10);
    l1.add(20);
    l1.add(30);
    l1.add(40);

    console.log(l1.printList());

    console.log(reverse_list(l1).printList());

}

//idea here should be: Current node points to previous node, if this node is head, it will point to null
//need to keep track where we are
function reverse_list(li_list){
    var current_node = li_list.head;
    var next_node = null;
    var previous_node = null;

    while (current_node){
        next_node = current_node.next;
        current_node.next = previous_node;
        previous_node = current_node;
        current_node = next_node;
    }
    li_list.head = previous_node;

    return li_list;
}

testing();


