package lab04;

import static org.junit.jupiter.api.Assertions.*;

import java.util.*;
import java.util.stream.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.*;
import org.junit.jupiter.params.provider.*;

class WordUtilitiesTest {

    @ParameterizedTest
    @MethodSource("swapTest")
    void swapCase(String description, String inputString, String expected){
        String result = WordUtilities.swapCase(inputString);
        assertEquals(expected, result);
    }

    private static Stream<Arguments> swapTest() {
        return Stream.of(Arguments.of("Simple String", "Hello", "hELLO"),
                Arguments.of("Space testing", "Apple Pie", "aPPLE pIE"),
                Arguments.of("Special Character", "Hel lo*", "hEL LO*"),
                Arguments.of("Nulls", null, null),
                Arguments.of("Empty", "", ""));
    }

}