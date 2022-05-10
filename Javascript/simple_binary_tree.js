//full (all nodes have 2 children except leaves)
//complete (All levels are filled maybe except last level, left to right)
//perfect (all internal nodes have 2 children, all leafe nodes are at same level)

//Implementing the tree, add and insert

class Node {
    constructor(element){
        this.val = element;
        this.left = this.right = null;
    }
}

class binary_tree {
    constructor(){
        this.root = null;
    }

    add_node(val) {
        this.root = this.insert_node(this.root, val)
    }

    insert_node(current_node, val){
        if (current_node == null){
            current_node = new Node(val);
            return current_node;
        }

        //main problem: If val of insert has same val of a current node
        if (val < current_node.val){
            current_node.left = this.insert_node(current_node.left, val);

        } else if (val > current_node.val){
            current_node.right = this.insert_node(current_node.right, val);
        }
        return current_node;
    }

    search(root, val){
        console.log(root);
        if (root == null) {
            return "not found";
        }

        if (root.val == val){
            return root;
        }

        if (root.val < val) {
            return this.search(root.right, val);
        }

        return this.search(root.left, val);
    }

    print_tree(){
        this.print_order(this.root);
    }

    print_order(val_of_node){
        if (val_of_node != null){
            this.print_order(val_of_node.left);
            console.log(val_of_node.val + " ");
            this.print_order(val_of_node.right);
        }
    }
}

function testing(){
    var test_tree = new binary_tree;

    test_tree.add_node(2);
    test_tree.add_node(1);
    test_tree.add_node(3);
    test_tree.add_node(5);
    console.log(test_tree);

}

testing();