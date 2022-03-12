package lab03;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import java.util.stream.Stream;
import static org.junit.jupiter.api.Assertions.*;

//write tests for 2 specification testing
/** Blackbox testing when we do not have access to source code
 * -Any deviation from documentation is either error in program, or error in documentation
 * -Try to establish boundary points as implied by documentation
 */
class SpecificationTest {
     /** Question 1) The xy values we provide are to be tested, and function will return true if this xy point lies
     * within the display area. Knowing that there are two modes of 1280x720 and 1920x1080 and that edge points are
     * considered within bounds, ON points are: (0,0), (1280x720), (1920x1080) and the equation should look like:
     * HD/FHD >= xy >= (0,0)
     * IN points are between 1280/1920 >= IN(x) >= 0 && 720/1080 >= IN(y) >= 0
     * This would mean our OFF and OUT points are (1281,720),(1280,721),(1921,1080),(1920,1081),(-1,0),(0,-1)
     *
     * The default mode is HD, and from the parameter input it looks like there is no way to change it through
     * the given parameters. This would mean when testing for FHD, there may be some problems.
     *
     * Due to the lack of information on how the display is exactly drawn, tests should also include additional
     * points on the other corners that are not (0,0) and (1280/1920,720/1080)
     * */
    @ParameterizedTest(name="xValue{0},yValue{1}")
    @CsvSource({"0,0","1280,720","1920,1080","1279,719","1919,1079"})
    void testingDisplayAreaOnIn(int xValue, int yValue){
        assertTrue(Specification.insideDisplayArea(xValue,yValue));
    }

    @ParameterizedTest(name="xValue{0},yValue{1}")
    @CsvSource({"1281,721","1921,1081","-1,-1","1281,0","0,720","1921,0","0,1081"})
    void testingDisplayAreaOffOut(int xValue, int yValue){
        assertFalse(Specification.insideDisplayArea(xValue,yValue));
    }

    /** AFTER IMPLEMENTATION COMMENTS
     * The tests for display area OFF and OUT ran flawlessly, but the ON points are incorrect for 1280x720
     * and 1920x1080. Two tests are added after, (1279,719) and (1919,1079). This tells may be that FHD is
     * not supported, and there is an error when evaluating the ON points of HD support.
     * */

    /** Question 2)
     * String input must be 2-6, so 6 >= String Length >= 2 or 7 >= String Length >= 2 if String has hyphen
     * What if string length == 7 with space? Max for motorcycle is 6. Must not contain only numbers
     * Expression should look like: strlen <= 6/7 && strlen >= 2
     * ->This means ON points are 2,6,7 and OFF points are 7,8,1
     * IN points are from 2-6 or 2-7 inclusive, and OUT points are everything else
     *
     * Due to the possibility that motorcycle may have its own separate function, tests should be a bit more extensive
     * Include one test with only numbers and only letters
     * Include a that has a hyphen
     * */

    @ParameterizedTest(name="message{0},isMotorcycle{1}")
    @CsvSource({"AB-123,True","B9,True","A-B C,True", "A-B, True", "A B, True"})
    void testingMotorCycleMessageTrue(String message, boolean isMotorcycle){
        assertTrue(Specification.messageIsValid(message, isMotorcycle));
    }

    @ParameterizedTest(name="message{0},isMotorcycle{1}")
    @CsvSource({"123456,True","A,True","ABC1234,True","--,True", "123-45, True", "123 45, True", "123*AB,True",
                "AB*, True", "*AB,True"})
    void testingMotorCycleMessageFalse(String message, boolean isMotorcycle){
        assertFalse(Specification.messageIsValid(message, isMotorcycle));
    }


    @ParameterizedTest(name="message{0},isMotorcycle{1}")
    @CsvSource({"ABC-123,False","B9,False", "ABCD123,False", "A-B C, False", "A B-C, False"})
    void testingMessageTrue(String message, boolean isMotorcycle){
        assertTrue(Specification.messageIsValid(message, isMotorcycle));
    }

    @ParameterizedTest(name="message{0},isMotorcycle{1}")
    @CsvSource({"123456,False","A,False","ABCD1234,False","--,False", "-AB,False", "AB-,False","- A,False",
                " -A,False", "A -B,False","A- B,False", "123-456,False", "123 456, False"})
    void testingMessageFalse(String message, boolean isMotorcycle){
        assertFalse(Specification.messageIsValid(message, isMotorcycle));
    }

    /** AFTER IMPLEMENTATION
     * All the tests that should have failed passed, which is a big red flag. All the details will be in the bug report
     * */
}