package pucp.edu.pe.sgta.service.imp;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import pucp.edu.pe.sgta.dto.JornadaExposicionXSalaExposicionListadoDTO;
import pucp.edu.pe.sgta.repository.ExposicionRepository;
import pucp.edu.pe.sgta.repository.JornadaExposicionXSalaExposicionRepository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class JornadaExposicionXSalaExposicionServiceImplTest {

	@Mock
	private JornadaExposicionXSalaExposicionRepository jornadaRepository;

	@InjectMocks
	private JornadaExposicionXSalaExposicionServiceImpl jornadaService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void getAll() {
	}

	@Test
	void findById() {
	}

	@Test
	void listarJornadasExposicionSalas() {
		Integer etapaFormativaId = 1;
		List<Object[]> mockData = new ArrayList<>();

		mockData.add(new Object[] { 1, Instant.now(), Instant.now().plusSeconds(3600), 101, "Sala 1" });
		mockData
			.add(new Object[] { 1, Instant.now().plusSeconds(3600), Instant.now().plusSeconds(7200), 102, "Sala 2" });
		mockData.add(new Object[] { 2, Instant.now(), Instant.now().plusSeconds(3600), 103, "Sala 3" });

		when(jornadaRepository.listarJornadasExposicionSalas(etapaFormativaId)).thenReturn(mockData);

		List<JornadaExposicionXSalaExposicionListadoDTO> result = jornadaService
			.listarJornadasExposicionSalas(etapaFormativaId);

		assertEquals(2, result.size()); // Verificamos que hay 2 jornadas (1 y 2)

		JornadaExposicionXSalaExposicionListadoDTO jornada1 = result.get(0);
		assertEquals(1, jornada1.getJornadaExposicionId());
		assertNotNull(jornada1.getDatetimeInicio());
		assertNotNull(jornada1.getDatetimeFin());
		assertTrue(jornada1.getDatetimeInicio().before(jornada1.getDatetimeFin()));
		assertEquals(2, jornada1.getSalasExposicion().size());
		assertEquals("Sala 1", jornada1.getSalasExposicion().get(0).getNombre());
		assertEquals("Sala 2", jornada1.getSalasExposicion().get(1).getNombre());

		// Verificamos la segunda jornada
		JornadaExposicionXSalaExposicionListadoDTO jornada2 = result.get(1);
		assertEquals(2, jornada2.getJornadaExposicionId());
		assertNotNull(jornada2.getDatetimeInicio());
		assertNotNull(jornada2.getDatetimeFin());
		assertEquals(1, jornada2.getSalasExposicion().size());
		assertEquals("Sala 3", jornada2.getSalasExposicion().get(0).getNombre());
	}

}