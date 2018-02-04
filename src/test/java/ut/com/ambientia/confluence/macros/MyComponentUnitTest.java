package ut.com.ambientia.confluence.macros;

import org.junit.Test;
import com.ambientia.confluence.macros.api.MyPluginComponent;
import com.ambientia.confluence.macros.impl.MyPluginComponentImpl;

import static org.junit.Assert.assertEquals;

public class MyComponentUnitTest
{
    @Test
    public void testMyName()
    {
        MyPluginComponent component = new MyPluginComponentImpl(null);
        assertEquals("names do not match!", "myComponent",component.getName());
    }
}