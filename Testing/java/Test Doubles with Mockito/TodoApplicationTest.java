
package lab06;

import org.junit.jupiter.api.*;
import org.junit.jupiter.params.*;
import org.junit.jupiter.params.provider.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.assertj.core.api.Assertions.*;

import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

import java.util.List;

class TodoApplicationTest {

    private TodoApplication todoApp;
    private PersonService personServiceMock;
    private TodoService todoServiceMock;

    private final String userName = "SomeUser";
    private final Long userID = 1L;
    private final List<String> todos = List.of("Wake up", "Test the code", "Celebrate the victory!");

    /**
     *TodoApplication toDoAppMock = mock(TodoApplication.class, withSettings().verboseLogging());
     *PersonService personServiceMock = mock(PersonService.class, withSettings().verboseLogging());
     *TodoService toDoServiceMock = mock(TodoService.class, withSettings().verboseLogging());
     * */

    @Test
    void addTodo() {
        // Ensure that it's possible to add a todo to the app, and that the correct methods are called
        //When given a username, retrieve a list of todos
        TodoService todoServiceMock = mock(TodoService.class, withSettings().verboseLogging());
        when(todoServiceMock.retrieveTodos(any())).thenReturn(List.of("Bake"));
        when(todoServiceMock.addTodo(any(),any())).thenReturn(true);

        //when given a long id, return username
        PersonService personServiceMock = mock(PersonService.class, withSettings().verboseLogging());
        when(personServiceMock.findUsernameById(any())).thenReturn("Bob");

        todoApp = new TodoApplication(todoServiceMock, personServiceMock);
        assertThat(todoApp.addTodo(1234L, "Pie")).isTrue();
        verify(todoServiceMock).addTodo(any(),any());
        verifyNoMoreInteractions(todoServiceMock);
    }

    @Test
    void retrieveTodos() {
        // add multiple todos to the app, and retrieve a strict subset of them using a substring.
        TodoService todoServiceMock = mock(TodoService.class, withSettings().verboseLogging());
        when(todoServiceMock.retrieveTodos(any())).thenReturn(List.of("Bake Apple","Bake Lemon", "Lettus"));
        when(todoServiceMock.addTodo(any(),any())).thenReturn(true);

        //when given a long id, return username
        PersonService personServiceMock = mock(PersonService.class, withSettings().verboseLogging());
        when(personServiceMock.findUsernameById(any())).thenReturn("Bob");

        todoApp = new TodoApplication(todoServiceMock, personServiceMock);
        assertThat(todoApp.retrieveTodos(1234L,"Bake")).containsExactly("Bake Apple", "Bake Lemon");
        verify(todoServiceMock).retrieveTodos(any());
        verifyNoMoreInteractions(todoServiceMock);
    }

    @Test
    void completeAllWithNoTodos() {
        // confirm that the appropriate behaviour occurs when there are no todos being tracked by the app
        TodoService todoServiceMock = mock(TodoService.class, withSettings().verboseLogging());
        when(todoServiceMock.retrieveTodos(any())).thenReturn(List.of());

        //when given a long id, return username
        PersonService personServiceMock = mock(PersonService.class, withSettings().verboseLogging());
        when(personServiceMock.findUsernameById(any())).thenReturn("Bob");

        todoApp = new TodoApplication(todoServiceMock, personServiceMock);
        todoApp.completeAllTodos(1234L);
        verify(personServiceMock).findUsernameById(any());
        assertThat(personServiceMock.findUsernameById(any())).isEqualTo("Bob");
        assertThat(todoServiceMock.retrieveTodos(any())).isEmpty();
        verify(todoServiceMock, times(0)).completeTodo(any());
    }

    @Test
    void completeAllWithThreeTodos() {
        // confirm that the appropriate behaviour occurs when there are three todos being tracked by the app
        TodoService todoServiceMock = mock(TodoService.class, withSettings().verboseLogging());
        when(todoServiceMock.retrieveTodos(any())).thenReturn(List.of("Bake Apple","Bake Lemon", "Lettus"));
        when(todoServiceMock.addTodo(any(),any())).thenReturn(true);

        //when given a long id, return username
        PersonService personServiceMock = mock(PersonService.class, withSettings().verboseLogging());
        when(personServiceMock.findUsernameById(any())).thenReturn("Bob");

        todoApp = new TodoApplication(todoServiceMock, personServiceMock);
        todoApp.completeAllTodos(1234L);
        verify(personServiceMock).findUsernameById(any());
        assertThat(personServiceMock.findUsernameById(any())).isEqualTo("Bob");
        assertThat(todoServiceMock.retrieveTodos(any())).isNotEmpty();
        verify(todoServiceMock, times(3)).completeTodo(any());
    }
}