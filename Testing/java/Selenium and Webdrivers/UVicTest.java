package lab05;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.safari.SafariDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.concurrent.TimeUnit;

public class UVicTest {

    WebDriver browser;

    @BeforeEach
    public void setUp() {
        // Chrome
        System.setProperty("webdriver.chrome.driver", "C:\\Users\\Nyuimo\\Desktop\\Seng275\\lab05\\chromedriver.exe");
        browser = new ChromeDriver();

        // Firefox
        // System.setProperty("webdriver.gecko.driver", "*****LOCATION OF YOUR WEBDRIVER*****");
        // browser = new FirefoxDriver();

        // Safari
        // browser = new SafariDriver();

        browser.manage().window().maximize();
    }

    @AfterEach
    public void cleanUp() {
        browser.quit();
    }


    // Your tests go here
    @Test
    public void uvicPageLoads(){
        //same as example, just change url and expected string
        browser.get("https://www.uvic.ca/");
        assertEquals("Home - University of Victoria", browser.getTitle());
    }

    //Could not find name, tagName, linkText or PartialLinkText
    @Test
    public void uvicSearchButton(){
        browser.get("https://www.uvic.ca/");
        //by Class name (fails)
        //WebElement magnifyingGlass = browser.findElement(By.className("btn btn-sm btn-outline-primary glbl__btn icoa icoa--up collapsed"));

        //by ID (works)
        WebElement magnifyingGlass = browser.findElement(By.id("search-btn"));

        //by xpath (works)
        //WebElement magnifyingGlass = browser.findElement(By.xpath("//*[@id=\"search-btn\"]"));

        //by Style (works)
        //WebElement magnifyingGlass = browser.findElement(By.cssSelector(".fas"));
        assertTrue(magnifyingGlass.isEnabled());
    }

    //I assume this means when button is press, we look for the dropdown
    //First click on the above button, then look for the same id, name etc... and assert
    @Test
    public void uvicButtonPress(){
        browser.get("https://www.uvic.ca/");
        //using ID here for the button, then allow a brief delay to circumvent race condition
        WebElement magnifyingButton = browser.findElement(By.id("search-btn"));
        magnifyingButton.click();
        new WebDriverWait(browser, 1);
        //by ID (works)
        //WebElement uvicSearchBox = browser.findElement(By.id("searchUVic"));

        //by Name (works)
        //WebElement uvicSearchBox = browser.findElement(By.name("q"));

        //by Class (works)
        //WebElement uvicSearchBox = browser.findElement(By.className("srch__lbl"));

        //by xpath (works)
        WebElement uvicSearchBox = browser.findElement(By.xpath("//*[@id=\"searchUVic\"]"));

        assertTrue(uvicSearchBox.isEnabled());
    }

    //Vulnerable to race condition from the time the button is clicked to the input box being available. This test is Flakyz
    @Test
    public void uvicCscTyped(){
        //need to click to toogle expand to true before input
        browser.get("https://www.uvic.ca/");
        WebElement magnifyingButton = browser.findElement(By.id("search-btn"));
        magnifyingButton.click();

        new WebDriverWait(browser, 1);
        WebElement inputBox = browser.findElement(By.xpath("//*[@id=\"searchUVic\"]"));
        inputBox.sendKeys("csc");

        assertEquals("csc", inputBox.getAttribute("value"));
    }

    //Vulnerable to race condition, for my browser it works with 1 second. This test is Flaky
    @Test
    public void uvicNewPageLoad(){
        browser.get("https://www.uvic.ca/");
        WebElement magnifyingButton = browser.findElement(By.id("search-btn"));
        magnifyingButton.click();

        WebElement inputBox = browser.findElement(By.xpath("//*[@id=\"searchUVic\"]"));
        inputBox.sendKeys("csc");
        inputBox.sendKeys(Keys.ENTER);

        //Alternative by using click
        //WebElement searchBtn = browser.findElement(By.xpath("//*[@id=\"searchMain\"]/div/div/form/div/button"));
        //searchBtn.click();

        //new WebDriverWait(browser, 1);
        //Alternative for condition:
        new WebDriverWait(browser, 5).until(ExpectedConditions.titleIs("Search - University of Victoria"));

        assertEquals("Search - University of Victoria", browser.getTitle());
    }

    /** My approach
     *  I first inspected the phone number itself at the bottom of the web page then assigned it to variable.
     *  From there I selected the 'Properties' tab to scroll through what I could compare the sting phone number to.
     *  Just so happens that there is a getText from the class I could use so I used it to compare strings*/
    @Test
    public void uvicPhoneNumber(){
        String phoneNumber = "1-250-721-7211";
        browser.get("https://www.uvic.ca/");
        WebElement phoneClass = browser.findElement(By.xpath("/html/body/footer/div/div[3]/div/div/div[2]/div/div[1]/ul/li[1]/a"));

        assertEquals(phoneNumber, phoneClass.getText());
    }
}
