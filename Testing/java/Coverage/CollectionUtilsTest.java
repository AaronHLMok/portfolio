package lab04;

import static org.junit.jupiter.api.Assertions.*;

import java.util.*;
import java.util.stream.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.*;
import org.junit.jupiter.params.provider.*;

class CollectionUtilsTest {

    @ParameterizedTest
    @MethodSource("collTest")
    void containsAny(String description, ArrayList<Integer> arrA, ArrayList<Integer> arrB, boolean expected){
        boolean result = CollectionUtils.containsAny(arrA, arrB);
        assertEquals(expected, result);
    }

    private static Stream<Arguments> collTest() {
        return Stream.of(Arguments.of("Double same", new ArrayList<>(Arrays.asList(1,2,3)), new ArrayList<>(Arrays.asList(1,2,3)), true),
                Arguments.of("A1 > A2", new ArrayList<>(Arrays.asList(1,2,3)), new ArrayList<>(Arrays.asList(1,2)), true),
                Arguments.of("A1 < A2 No Match", new ArrayList<>(Arrays.asList(1,2)), new ArrayList<>(Arrays.asList(3,4,5)), false),
                Arguments.of("A1 < A2", new ArrayList<>(Arrays.asList(1,2)), new ArrayList<>(Arrays.asList(1,2,3)), true),
                Arguments.of("No match", new ArrayList<>(Arrays.asList(1,2,3)), new ArrayList<>(Arrays.asList(4,5,6)), false));
    }

}