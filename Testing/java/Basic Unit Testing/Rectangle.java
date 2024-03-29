/*
 * This Java source file was generated by the Gradle 'init' task.
 */

package lab02;
import java.io.*;

public class Rectangle {
    private int x;
    private int y;
    private int width;
    private int height;

    public int getX() { return x; }
    public int getY() { return y; }
    public int getWidth() { return width; }
    public int getHeight() { return height; }

    //The default rectangle will be (0,0,1,1)
    public Rectangle() {this(0,0,1,1);}

    //Create custom Rectangle with given parameters, code here is given by David.
    public Rectangle(int x, int y, int width, int height){
        this.x = x;
        this.y = y;

        if (width <= 0){
            throw new IllegalArgumentException();
        }
        this.width = width;

        if (height <= 0){
            throw new IllegalArgumentException();
        }
        this.height = height;
    }

    //Methods for changing values of a rectangle
    public void setWidth(int new_width){
        if (new_width <= 0) {
            throw new IllegalArgumentException();
        }
        this.width = new_width;
    }

    public void setHeight(int new_height){
        if (new_height <= 0) {
            throw new IllegalArgumentException();
        }
        this.height = new_height;
    }

    public void setX(int x){
        this.x = x;
    }

    public void setY(int y){
        this.y = y;
    }

    //overriding equals() to compare two rectangles. Compare xy width/height and return true/false
    @Override
    public boolean equals(Object rectangle){
        //check if the object is itself
        if (rectangle == this){
            return true;
        }

        //Typecast to compare data
        Rectangle compare_rectangle = (Rectangle) rectangle;

        if (Integer.compare(this.x, compare_rectangle.getX()) == 0 &&
                Integer.compare(this.y, compare_rectangle.getY()) == 0 &&
                Integer.compare(this.width, compare_rectangle.getWidth()) == 0 &&
                Integer.compare(this.height, compare_rectangle.getHeight()) == 0){
            return true;
        }
        return false;
    }

    /*the reason why I did not add a class attribute area is because we would need to recalculate
    * the area if any of the value changes. It seems to be better to calculate area on the spot instead*/
    public int getArea(){
        //basic area of a rectangle is width times height
        int area = this.width * this.height;
        return area;
    }

    /*First check area, If R2's area is larger than R, no way it can fit inside R
    * Second we check if upper left exists within the larger rectangle
    * Lastly when we build the smaller rectangle, it should not exceed boundary of larger one
    * */
    public boolean rectangleBoundary(Object rect){
        //Typecast to compare data
        Rectangle compare_rectangle = (Rectangle) rect;

        if (compare_rectangle.getArea() > this.getArea()){
            return false;
        }

        if (compare_rectangle.x < this.x || compare_rectangle.y < this.y){
            return false;
        }

        if (compare_rectangle.x + compare_rectangle.width > this.x + this.width ||
            compare_rectangle.y + compare_rectangle.height > this.y + this.height){
            return false;
        }
        return true;
    }
}
