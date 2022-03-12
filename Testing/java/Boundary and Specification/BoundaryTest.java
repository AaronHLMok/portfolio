package lab03;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

//Write tests for 3 boundary testing exercise, Please skip to line 65
class BoundaryTest {

    /* The specification mentioned in the pdf are:
    *  Returns true if sound level > 85 (note there is no '='
    *  @param: Volume the volume of sound in decibels
    *  @return true if volume is unsafe, false otherwise*/
    @Test
    void isUnsafe() {
        //this tests the OFF and OUT points
        assertTrue(Boundary.isUnsafe(86));
    }

    @Test
    void isNotUnsafe() {
        //This tests the ON and OUT points
        assertFalse(Boundary.isUnsafe(85));

        //This would test the IN points
        //Once again, this is up to the tester as the implementation may behave differently
        assertTrue(Boundary.isUnsafe(84));
    }

    /*ValueSource can be seen as the parameters we want to test
    * Note that Junit creates a test for each value, so 3 in total
    * To test multiple arguments, we need @CSVSource or @MethodSource*/

    /*@ParameterizedTest(name="volume{0},code{1}")
    @CsvSource({"86,BC","87,AB"})
    void paramTesting(int volume, String code){
        //do something with code
        assertTrue(Boundary.isUnsafe(volume));
    }*/

    /*@ParameterizedTest(name="volume{0},code{1}")
    @MethodSource("allTheVolumes")
    void paramTesting(int volume, String code){
        assertTrue(Boundary.isUnsafe(volume));
        }

    private static Stream<Arguments> allTheVolumes(){
        return Stream.of(
            Arguments.of(86,"BC"),
            Arguments.of(87,"AB"));
    }*/

    @ParameterizedTest
    @ValueSource(ints = {90,120,128})
    void paramTesting(int volume) {
        assertTrue(Boundary.isUnsafe(volume));
    }

    /*Questions: Write tests for 3 remaining methods in Boundar.java
    * -Determine Boundary ON/OFF and figure out IN/OUT points*/

    /** Question 1)
     * The statement is: temp >= 5 && temp <= 20, so the comfy zone is between 5-20 inclusive
     * splitting this up, we get ON at 5 and 20; for temp >= 5, OFF = 4; for temp <= 20, OFF = 21
     * our IN points will be 5-20 and OUT is everything else
     * Test (5,20) -> Both ON and IN points
     * Test (4,21) -> Both OFF and OUT points
    */
    @ParameterizedTest
    @ValueSource(ints = {5,20})
    void isComfyTest(int temp){
        assertTrue(Boundary.isComfortable(temp));
    }

    @ParameterizedTest
    @ValueSource(ints = {4,21})
    void isNotComfyTest(int temp){
        assertFalse(Boundary.isComfortable(temp));
    }

    /** Question 2)
     *  There are three different return values being (0,1,2). First notice that the comparator is <>, this mean we
     *  should beware of values when they are '='. The ON values are (2,6) and their OFF values are (1,5) respectively
     *  2: In values are 1 and below, OUT values are 2 and above
     *  6: In values are 5 and below, OUT values are 6 and above
     * */
    @ParameterizedTest(name="expectedValue{0},testValue{1}")
    @CsvSource({"0,1","1,2","1,5","2,6"})
    void elevatorTest(int expectedValue, int testValue){
        //Testing 1 will cover the IN and OFF values for 2
        //Testing 2 will cover the ON and OUT value of 2 and IN value of 6
        //Testing 5 will cover OUT value of 2 and IN and OFF value for 6
        //Testing 6 will cover ON and OUT value of 6
        assertEquals(expectedValue,Boundary.elevatorsRequired(testValue));
    }

    /** Question 3)
     *  Note: The function takes double, need to test double numbers.
     *  The ON values are: 0,50,60,65,70,73,77,80,85,90 and 100
     *  The OFF values are: 49.99--,59.99--,64.99--,69.99--,72.99--,76.99--,79.99--,84.99--,89.99--
     *  For the throws, our OFF values are -0.99-- and 100.0---1
     *  IN values differ for each 'if' statement in the function, but testing the OFF values will also test IN
     *  Additionally, by testing the ON values we test the OUT values of the previous 'if' statement in the function
     * */
    @ParameterizedTest(name="expectedGrade{0},testValue{1}")
    @CsvSource({"F,0","D,50","C,60","C+,65","B-,70","B,73","B+,77","A-,80","A,85","A+,90","A+,100",
                "F,49.99","D,59.99","C,64.99","C+,69.99","B-,72.99","B,76.99","B+,79.99", "A-,84.99", "A,89.99"})
    void gradeTest(String expectedGrade, double testValue) {
        assertEquals(expectedGrade, Boundary.percentageToLetterGrade(testValue));
    }

    @ParameterizedTest
    @ValueSource(doubles = {-0.99,100.01})
    void gradeThrow(double throwingValues) {
        assertThrows(IllegalArgumentException.class, () -> {Boundary.percentageToLetterGrade(throwingValues);});
    }
}