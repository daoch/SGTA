package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pucp.edu.pe.sgta.model.ZoomAccessTokenResponse;
import pucp.edu.pe.sgta.model.ZoomMeetingRequest;
import pucp.edu.pe.sgta.model.ZoomMeetingResponse;
import pucp.edu.pe.sgta.service.inter.ZoomService;

@RestController
@RequestMapping("/zoom")
public class ZoomController {
    @Autowired
    private ZoomService zoomService;

    // API PARA CREAR UNA REUNIÓN DE ZOOM
    @PostMapping("/crear-meeting")
    public ZoomMeetingResponse createMeeting(@RequestBody ZoomMeetingRequest zoomMeetingRequest) {
        return zoomService.createMeeting(zoomMeetingRequest);
    }

    // API PARA GENERAR EL TOKEN DE ACCESO
    @PostMapping("/generar-token-acceso")
    public ZoomAccessTokenResponse generateAccessToken() {
        return zoomService.generateAccessToken();
    }
}
