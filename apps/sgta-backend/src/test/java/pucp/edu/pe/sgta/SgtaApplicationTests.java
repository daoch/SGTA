package pucp.edu.pe.sgta;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.ActiveProfiles;

import software.amazon.awssdk.services.s3.S3Client;
@ExtendWith(SpringExtension.class)
@SpringBootTest
class SgtaApplicationTests {
	@Mock
	private S3Client s3Client;

	@Test
	void contextLoads() {
	}
}


