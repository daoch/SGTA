package pucp.edu.pe.sgta.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import java.io.IOException;
import java.time.Duration;

/**
 * Custom deserializer to convert ISO-8601 duration strings to Java Duration objects
 */
public class DurationDeserializer extends JsonDeserializer<Duration> {

	@Override
	public Duration deserialize(JsonParser parser, DeserializationContext context) throws IOException {
		String text = parser.getText();
		if (text == null || text.isEmpty()) {
			return null;
		}

		try {
			return Duration.parse(text);
		}
		catch (Exception e) {
			throw new IOException("Error parsing duration: " + text, e);
		}
	}

}