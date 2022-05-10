using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Player : MonoBehaviour
{
    [SerializeField] private Transform groundCheckTransform = null;
    [SerializeField] private LayerMask playerMask;
    private bool jumpKeyWasPressed;
    private float horizontalInput;
    private Rigidbody rigidBodyComponent;

    //private bool isGrounded;

    // Start is called before the first frame update
    void Start()
    {
        //Creating an instance of our rigid body will reduce the number of accesses, making the game run faster.
        rigidBodyComponent = GetComponent<Rigidbody>();
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space) || Input.GetKeyDown(KeyCode.W))
        {
            jumpKeyWasPressed = true;
            FixedUpdate();
        }

        /*
         * Unity has standard input for <-/a and ->/d key, positive and negative horizontal movement. This setting can be changed in project setting/input manager
         * This inputmanager is usefull to adjust speed of an object. Additionally, horizontalInput here will be constantly updated thus we don't need the getdown 
         * function. When a player enters a horizontal direction it will feed a float number.
         */
        horizontalInput = Input.GetAxis("Horizontal") * 2;
    }

    // Updates 100 times per second (syncs with physics), no longer bound by frames. Can change by increasing frequency etc...
    // Fixed update is under monobehavior
    private void FixedUpdate()
    {
        //Creating new vector3 here will 'move' the game object. We must get the original velocity of the game object to retain consitant speed. 
        //By setting values 0,0 for y,z the physics engine will fight line 40, making a 'slow' effect as we set velocity to 0
        rigidBodyComponent.velocity = new Vector3(horizontalInput, rigidBodyComponent.velocity.y, rigidBodyComponent.velocity.z);

        // by doing LayerMask, we can avoid collisions of objects within the same layer
        // There is also checksphere which returns a bool
        if (Physics.OverlapSphere(groundCheckTransform.position, 0.1f, playerMask).Length == 0) 
        {
            return;
        }

        if (jumpKeyWasPressed)
        {
            //vector3.up is the same as adding y by 1 unit, or Vector3(0,1,0)
            //ForceMode has 4 different modes, be sure change depending on use
            rigidBodyComponent.AddForce(Vector3.up * 7, ForceMode.VelocityChange);
            jumpKeyWasPressed = false;
        }

    }

    // Triggers: Notice this is a component of player. The other collider that is passed onto this function is the collider in which the player object
    // is interacting with (coin in this case)
    private void OnTriggerEnter(Collider other)
    {
        // we need the number in which the coin layer is associated with, in this case coin is 7
        if (other.gameObject.layer == 7) {
            Destroy(other.gameObject);
            //we can do something here, increment score maybe
        }
    }
}

/*
// OnCollisionEnter is when two collisions touch. Warning, do not give attributes like scenary or ground this property
// This is under monobehavior
private void OnCollisionEnter(Collision collision)
{
    isGrounded = true;
}

private void OnCollisionExit(Collision collision)
{
    isGrounded = false;
}

This overlap sphere basically checks a radius around the given postion and returns an array of collision, in this case we 
just want to detect if our overlap is touching anything at all. We know for a fact that if there are no collisions, then the length
of this array is 0 (not touching anything). Warning, this way of collision detection means that the overlap will collide with player object
if (Physics.OverlapSphere(groundCheckTransform.position, 0.1f).Length ==  0) 
{
    return;
}
*/
