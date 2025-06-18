import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, NgIf],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  medicoForm: FormGroup;
  mensaje: string = '';
  error: boolean = false;
  seccion: string = 'medicos'; // 🔹 Inicialmente muestra médicos

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      cedula: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      especialidad: ['', Validators.required],
      registroProfesional: ['', Validators.required]
    });
  }

  onSubmit(): void {
    console.log('Formulario enviado:', this.medicoForm.value);
    const credentials = btoa('admin@demo.com:admin123');
    const headers = {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json'
    };

    this.http.post('http://localhost:8080/api/registro/medico', this.medicoForm.value, { headers })
      .subscribe({
        next: () => {
          this.mensaje = '✅ Médico registrado correctamente';
          this.error = false;
          this.medicoForm.reset();
        },
        error: (err) => {
          this.mensaje = err.error?.message || '❌ Error al registrar médico';
          this.error = true;
          console.error('Error:', err);
        }
      });
  }
}