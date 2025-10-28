import { Controller } from '@nestjs/common';
import { ServiciosActivosAdquiridosService } from './servicios_activos_adquiridos.service';

@Controller('servicios-activos-adquiridos')
export class ServiciosActivosAdquiridosController {
  constructor(
    private readonly serviciosActivosAdquiridosService: ServiciosActivosAdquiridosService,
  ) {}
}
