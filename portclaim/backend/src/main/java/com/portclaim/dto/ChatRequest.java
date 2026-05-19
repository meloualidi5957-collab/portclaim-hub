package com.portclaim.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ChatRequest {
    @NotBlank(message = "La question ne peut pas être vide")
    private String question;
}