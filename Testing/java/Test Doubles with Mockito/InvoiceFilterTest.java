package lab06;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.*;
import java.util.stream.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.*;
import org.junit.jupiter.params.provider.*;

class InvoiceFilterTest {
    private InvoiceFilter invoiceFilter;
    private IssuedInvoices issuedInvoices;

    /** Added some tests not related to the example*/
    @Test
    void myTesting(){
        IssuedInvoices issuedInvoicesMock = mock(IssuedInvoices.class, withSettings().verboseLogging());
        invoiceFilter = new InvoiceFilter(issuedInvoicesMock);
        //invoiceFilter.lowValueInvoices();
        //check if all() method was called
        verify(issuedInvoicesMock).all();

        //check if save() was called with any arguments, side note: logging says .save() is never called
        //verify(issuedInvoicesMock).save(any());

        //check if all() was called exactly once, works when line 25 is enabled
        //verify(issuedInvoicesMock, times(1)).all();

        //Verify that no methods were called on a mock object, passes when line 25 is commented
        //verifyNoInteractions(issuedInvoicesMock);

        //Verify that no other methods were called on mocked object other than one that were already verified
        //works when line 25 is enabled
        //verifyNoMoreInteractions(issuedInvoicesMock);
    }

    //Promoting dummy to stub, then stub to mock
    @Test
    void stubTest(){
        IssuedInvoices issuedInvoicesStub = mock(IssuedInvoices.class);
        when(issuedInvoicesStub.all()).thenReturn(List.of(new Invoice(43), new Invoice(99)));
        invoiceFilter = new InvoiceFilter(issuedInvoicesStub);
        assertThat(invoiceFilter.lowValueInvoices()).containsExactly(new Invoice(43), new Invoice(99));

        //mock promotion via verification
        verify(issuedInvoicesStub,times(1)).all();
        verifyNoMoreInteractions(issuedInvoicesStub);
    }

    @Test
    void myAssertJTest(){
        //assertThat("Hello").isNotEqualTo("hello");
        //expect the following to fail, Expecting actual: Hello -> not to be equal to Hello
        //assertThat("Hello").isNotEqualTo("Hello");

        //will compare the true value of the isSameAs()
        //assertThat("Pie").isSameAs("Pie");
        //assertThat("Pie").isSameAs("pie");
        //int Pie = 0;
        //assertThat("Pie").isSameAs(Pie);

        assertEquals("1","2");
    }

    @Test
    void allHighValueInvoices() {
        // every invoice in the list should be high-value
        IssuedInvoices issuedInvoicesStub = mock(IssuedInvoices.class);
        when(issuedInvoicesStub.all()).thenReturn(List.of(new Invoice(43), new Invoice(200), new Invoice(101)));
        invoiceFilter = new InvoiceFilter(issuedInvoicesStub);
        assertThat(invoiceFilter.HighValueInvoices()).containsExactly(new Invoice(200), new Invoice(101));

        //mock promotion via verification
        verify(issuedInvoicesStub,times(1)).all();
        verifyNoMoreInteractions(issuedInvoicesStub);
    }

    @Test
    void allLowValueInvoices() {
        // every invoice in the list should be low-value
        IssuedInvoices issuedInvoicesStub = mock(IssuedInvoices.class);
        when(issuedInvoicesStub.all()).thenReturn(List.of(new Invoice(43), new Invoice(99), new Invoice(101)));
        invoiceFilter = new InvoiceFilter(issuedInvoicesStub);
        assertThat(invoiceFilter.lowValueInvoices()).containsExactly(new Invoice(43), new Invoice(99));

        //mock promotion via verification
        verify(issuedInvoicesStub,times(1)).all();
        verifyNoMoreInteractions(issuedInvoicesStub);
    }

    @Test
    void someLowValueInvoices() {
        // Some low value invoices, some high
        IssuedInvoices issuedInvoicesStub = mock(IssuedInvoices.class);
        when(issuedInvoicesStub.all()).thenReturn(List.of(new Invoice(43), new Invoice(75),
                new Invoice(101), new Invoice(149), new Invoice(205)));
        invoiceFilter = new InvoiceFilter(issuedInvoicesStub);
        assertThat(invoiceFilter.someLowValueInvoices()).containsExactly(new Invoice(43), new Invoice(205));

        //mock promotion via verification
        verify(issuedInvoicesStub,times(1)).all();
        verifyNoMoreInteractions(issuedInvoicesStub);
    }

}
