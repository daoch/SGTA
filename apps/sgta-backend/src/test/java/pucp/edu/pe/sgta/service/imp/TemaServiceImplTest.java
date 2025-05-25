package pucp.edu.pe.sgta.service.imp;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import pucp.edu.pe.sgta.dto.TemaConAsesorJuradoDTO;
import pucp.edu.pe.sgta.repository.TemaRepository;
import pucp.edu.pe.sgta.service.inter.TemaService;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import java.util.List;

class TemaServiceImplTest {

	@Mock
	private TemaRepository temaRepository;

	@InjectMocks
	private TemaServiceImpl temaService;

	@BeforeEach
	public void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void listarTemasCicloActualXEtapaFormativa() {
		Integer etapaFormativaId = 1;
		List<Object[]> mockData = new ArrayList<>();
		mockData.add(new Object[] { 1, "codigo1", "Titulo Tema 1" });
		mockData.add(new Object[] { 2, "codigo2", "Titulo Tema 2" });

		// Simulamos el comportamiento del repositorio
		when(temaRepository.listarTemasCicloActualXEtapaFormativa(etapaFormativaId)).thenReturn(mockData);

		// Llamamos al servicio para obtener los temas
		List<TemaConAsesorJuradoDTO> result = temaService.listarTemasCicloActualXEtapaFormativa(etapaFormativaId);

		// Verificamos los resultados
		assertEquals(2, result.size()); // Comprobamos que hay dos elementos
		assertEquals(1, result.get(0).getId()); // Comprobamos el ID del primer tema
		assertEquals("codigo1", result.get(0).getCodigo()); // Comprobamos el código del
															// primer tema
		assertEquals("Titulo Tema 1", result.get(0).getTitulo()); // Comprobamos el título
																	// del primer tema

		assertEquals(2, result.get(1).getId()); // Comprobamos el ID del segundo tema
		assertEquals("codigo2", result.get(1).getCodigo()); // Comprobamos el código del
															// segundo tema
		assertEquals("Titulo Tema 2", result.get(1).getTitulo()); // Compro
	}

}