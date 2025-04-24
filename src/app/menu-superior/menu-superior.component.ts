import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-menu-superior',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './menu-superior.component.html',
  styleUrl: './menu-superior.component.css'
})
export class MenuSuperiorComponent implements OnInit {
  formulario!: FormGroup;
  participantes: any[] = []; 
  erroAdicionarParticipante: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      evento: ['', Validators.required],
      modalidade: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataTermino: ['', [Validators.required, this.validarDataTermino.bind(this)]],
      nomeCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, this.validarCPF]],
      tipoIngresso: ['', Validators.required]
    });

    
    const dadosSalvos = localStorage.getItem('formulario');
    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos);
      this.formulario.patchValue(dados);
      this.participantes = dados.participantes || [];
    }
  }

  adicionarParticipante(): void {
    const participante = {
      nomeCompleto: this.formulario.get('nomeCompleto')?.value,
      email: this.formulario.get('email')?.value,
      cpf: this.formulario.get('cpf')?.value,
      tipoIngresso: this.formulario.get('tipoIngresso')?.value,
      evento: this.formulario.get('evento')?.value 
    };

    if (this.validarParticipante(participante)) {
      this.participantes.push(participante); 
      this.formulario.patchValue({
        nomeCompleto: '',
        email: '',
        cpf: '',
        tipoIngresso: ''
      }); 
      this.erroAdicionarParticipante = false; 
      this.salvarNoLocalStorage(); 
    } else {
      this.erroAdicionarParticipante = true; 
    }
  }

  removerParticipante(index: number): void {
    this.participantes.splice(index, 1);
    this.salvarNoLocalStorage();
  }

  validarParticipante(participante: any): boolean {
    return (
      participante.nomeCompleto &&
      participante.email &&
      participante.cpf &&
      participante.tipoIngresso
    );
  }

  salvarNoLocalStorage(): void {
    const dados = {
      ...this.formulario.value,
      participantes: this.participantes
    };
    localStorage.setItem('formulario', JSON.stringify(dados));
  }

  validarDataTermino(control: AbstractControl): { [key: string]: boolean } | null {
    const dataInicio = this.formulario?.get('dataInicio')?.value;
    const dataTermino = control.value;
    if (dataInicio && dataTermino && new Date(dataTermino) <= new Date(dataInicio)) {
      return { dataInvalida: true };
    }
    return null;
  }

  validarCPF(control: AbstractControl): { [key: string]: boolean } | null {
    const cpf = control.value;
    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!regex.test(cpf)) {
      return { cpfInvalido: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.formulario.valid && this.participantes.length > 0) {
      console.log('Dados do formulário:', {
        ...this.formulario.value,
        participantes: this.participantes
      });
      alert('Formulário enviado com sucesso!');
      localStorage.removeItem('formulario');
      this.formulario.reset();
      this.participantes = [];
    } else {
      alert('Por favor, preencha todos os campos obrigatórios e adicione pelo menos um participante.');
    }
  }
}