package pucp.edu.pe.sgta.service.imp;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import pucp.edu.pe.sgta.dto.ExposicionNombreDTO;
import pucp.edu.pe.sgta.repository.ExposicionRepository;

import java.util.ArrayList;
import java.util.List;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

class ExposicionServiceImplTest {

    @Mock
    private ExposicionRepository exposicionRepository;

    @InjectMocks
    private ExposicionServiceImpl exposicionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    void listarExposicionXCicloActualEtapaFormativa() {
        Integer etapaFormativaId = 1;
        List<Object[]> mockData = new ArrayList<>();
        mockData.add(new Object[]{1, "Exposicion 1"});
        mockData.add(new Object[]{2, "Exposicion 2"});


        when(exposicionRepository.listarExposicionXCicloActualEtapaFormativa(etapaFormativaId)).thenReturn(mockData);


        List<ExposicionNombreDTO> result = exposicionService.listarExposicionXCicloActualEtapaFormativa(etapaFormativaId);


        assertEquals(2, result.size());
        assertEquals(1, result.get(0).getId());
        assertEquals("Exposicion 1", result.get(0).getNombre());

    }
}