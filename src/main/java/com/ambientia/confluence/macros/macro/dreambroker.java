package com.ambientia.confluence.macros.macro;

import com.atlassian.confluence.content.render.xhtml.ConversionContext;
import com.atlassian.confluence.macro.Macro;
import com.atlassian.confluence.macro.MacroExecutionException;

import com.atlassian.plugin.spring.scanner.annotation.component.Scanned;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;
import com.atlassian.webresource.api.assembler.PageBuilderService;
import org.springframework.beans.factory.annotation.Autowired;

import com.atlassian.confluence.renderer.radeox.macros.MacroUtils;
import com.atlassian.confluence.util.GeneralUtil;
import com.atlassian.confluence.util.velocity.VelocityUtils;
import org.apache.velocity.VelocityContext;

import java.util.Map;
import java.net.*;
import java.io.*;

@Scanned

public class dreambroker implements Macro {

    private PageBuilderService pageBuilderService;

    @Autowired
    public dreambroker(@ComponentImport PageBuilderService pageBuilderService) {
        this.pageBuilderService = pageBuilderService;
    }

    public String execute(Map<String, String> map, String s, ConversionContext conversionContext) throws MacroExecutionException {

		pageBuilderService.assembler().resources().requireWebResource("com.ambientia.confluence.macros.dreambrokerFeed:dreambrokerFeed-resources");

        String dbJson = "";

        if (map.get("Url") != null){
	        try {
	        	dbJson = DownloadJSON(map.get("Url"));
	        } catch (Exception e) {
	        	dbJson = "URL incorrect";
	        }        	
        }
	
		Map context = MacroUtils.defaultVelocityContext();
    	context.put("jsonFeed", dbJson);
    	return VelocityUtils.getRenderedTemplate("/templates/dreambroker.vm", context);
    
    }

    public BodyType getBodyType() { return BodyType.NONE; }

    public OutputType getOutputType() { return OutputType.BLOCK; }

    public String DownloadJSON(String URL) throws Exception {
        URL jsonURL = new URL(URL);
        BufferedReader in = new BufferedReader(
        new InputStreamReader(jsonURL.openStream()));

        String inputLine;
        String jsonStream = "";

        while ((inputLine = in.readLine()) != null)
            jsonStream = jsonStream + inputLine;
        in.close();
 		
 		return jsonStream;
    }



}    
