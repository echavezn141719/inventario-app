package com.efsrt.inventario.service;

import com.efsrt.inventario.dto.request.LoginRequest;
import com.efsrt.inventario.dto.response.AuthResponse;
import com.efsrt.inventario.entity.Usuario;
import com.efsrt.inventario.exception.ResourceNotFoundException;
import com.efsrt.inventario.repository.UsuarioRepository;
import com.efsrt.inventario.security.UserDetailsServiceImpl;
import com.efsrt.inventario.security.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "email", request.getEmail()));

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtUtil.generarToken(userDetails,
                Map.of("rol", usuario.getRol().name(), "nombre", usuario.getNombre()));

        return AuthResponse.builder()
                .token(token)
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .rol(usuario.getRol().name())
                .build();
    }
}