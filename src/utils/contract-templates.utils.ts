import { ContractType, ContractFormData, Property } from '@/models/contract.model'


interface TemplateData extends ContractFormData {
    property: Property
    currentDate: string
}

function numeroALetras(num: number): string {
    const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE']
    const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA']
    const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS']

    if (num === 0) return 'CERO'
    if (num >= 1000000) return 'UN MILLÓN'

    let resultado = ''

    if (num >= 1000) {
        const miles = Math.floor(num / 1000)
        if (miles === 1) {
            resultado += 'MIL '
        } else {
            resultado += unidades[miles] + ' MIL '
        }
        num %= 1000
    }

    if (num >= 100) {
        resultado += centenas[Math.floor(num / 100)] + ' '
        num %= 100
    }

    if (num >= 10) {
        resultado += decenas[Math.floor(num / 10)] + ' '
        num %= 10
    }

    if (num > 0) {
        resultado += unidades[num] + ' '
    }

    return resultado.trim()
}

export const contractTemplates: Record<ContractType, (data: TemplateData) => string> = {
  [ContractType.VENTA]: (data: TemplateData) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 40px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .section {
          margin-bottom: 30px;
        }
        .signatures {
          margin-top: 100px;
          display: flex;
          justify-content: space-between;
        }
        .signature-box {
          text-align: center;
          width: 40%;
        }
        .signature-line {
          border-bottom: 1px solid #000;
          margin-bottom: 5px;
          height: 40px;
        }
        h1 { font-size: 24px; }
        h2 { font-size: 18px; margin-top: 30px; }
        .data { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>CONTRATO DE COMPRAVENTA DE INMUEBLE</h1>
        <p>Contrato N°: <span class="data">${data.contractNumber}</span></p>
        <p>Fecha: <span class="data">${data.currentDate}</span></p>
      </div>

      <div class="section">
        <p>Conste por el presente documento privado de CONTRATO DE COMPRAVENTA DE INMUEBLE, que celebran:</p>
        
        <p><strong>EL VENDEDOR:</strong> ${data.agentName}, con C.I. ${data.agentDocument}, mayor de edad, hábil por derecho.</p>
        
        <p><strong>EL COMPRADOR:</strong> ${data.clientName}, con C.I. ${data.clientDocument}${data.clientPhone ? `, teléfono ${data.clientPhone}` : ''}${data.clientEmail ? `, email ${data.clientEmail}` : ''}, mayor de edad, hábil por derecho.</p>
      </div>

      <h2>PRIMERA: OBJETO DEL CONTRATO</h2>
      <div class="section">
        <p>El VENDEDOR declara ser propietario legítimo del inmueble ubicado en: <span class="data">${data.property.address}</span>${data.property.city ? `, ${data.property.city}` : ''}${data.property.zone ? `, zona ${data.property.zone}` : ''}, el cual vende y transfiere en favor del COMPRADOR con todos los usos, costumbres, servidumbres y todo cuanto de hecho y por derecho le corresponde.</p>
      </div>

      <h2>SEGUNDA: PRECIO Y FORMA DE PAGO</h2>
      <div class="section">
        <p>El precio total de la venta se fija en la suma de <span class="data">$us ${data.amount}</span> (${numeroALetras(parseFloat(data.amount))} DÓLARES AMERICANOS), cantidad que será cancelada de la siguiente manera:</p>
        <ul>
          <li>Al momento de la firma del presente contrato.</li>
          <li>Mediante transferencia bancaria / efectivo / cheque.</li>
        </ul>
      </div>

      <h2>TERCERA: ENTREGA DEL INMUEBLE</h2>
      <div class="section">
        <p>La entrega material del inmueble se realizará en fecha <span class="data">${data.startDate}</span>, comprometiéndose el VENDEDOR a entregar el inmueble completamente desocupado y en las condiciones actuales.</p>
      </div>

      <h2>CUARTA: DOCUMENTACIÓN</h2>
      <div class="section">
        <p>El VENDEDOR se compromete a entregar toda la documentación legal del inmueble, incluyendo:</p>
        <ul>
          <li>Folio Real actualizado</li>
          <li>Certificado catastral</li>
          <li>Planos aprobados</li>
          <li>Paz y salvo de impuestos</li>
        </ul>
      </div>

      <h2>QUINTA: OBLIGACIONES DE LAS PARTES</h2>
      <div class="section">
        <p>Ambas partes se obligan a cumplir con todas las disposiciones legales vigentes para la transferencia del inmueble, comprometiéndose a firmar la minuta de transferencia ante Notaría de Fe Pública.</p>
      </div>

      ${data.notes ? `
      <h2>SEXTA: OBSERVACIONES</h2>
      <div class="section">
        <p>${data.notes}</p>
      </div>
      ` : ''}

      <h2>CONFORMIDAD</h2>
      <div class="section">
        <p>En señal de conformidad y aceptación con todas y cada una de las cláusulas del presente contrato, firmamos al pie del presente documento.</p>
      </div>

      <div class="signatures">
        <div class="signature-box">
          <div class="signature-line"></div>
          <p><strong>${data.agentName}</strong></p>
          <p>C.I. ${data.agentDocument}</p>
          <p>VENDEDOR</p>
        </div>
        <div class="signature-box">
          <div class="signature-line"></div>
          <p><strong>${data.clientName}</strong></p>
          <p>C.I. ${data.clientDocument}</p>
          <p>COMPRADOR</p>
        </div>
      </div>
    </body>
    </html>
  `,

  [ContractType.COMPRA]: (data: TemplateData) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 40px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .section {
          margin-bottom: 30px;
        }
        .signatures {
          margin-top: 100px;
          display: flex;
          justify-content: space-between;
        }
        .signature-box {
          text-align: center;
          width: 40%;
        }
        .signature-line {
          border-bottom: 1px solid #000;
          margin-bottom: 5px;
          height: 40px;
        }
        h1 { font-size: 24px; }
        h2 { font-size: 18px; margin-top: 30px; }
        .data { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>CONTRATO DE PROMESA DE COMPRA</h1>
        <p>Contrato N°: <span class="data">${data.contractNumber}</span></p>
        <p>Fecha: <span class="data">${data.currentDate}</span></p>
      </div>

      <div class="section">
        <p>Conste por el presente documento privado de PROMESA DE COMPRA DE INMUEBLE, que celebran:</p>
        
        <p><strong>EL PROMITENTE COMPRADOR:</strong> ${data.agentName}, con C.I. ${data.agentDocument}, mayor de edad, hábil por derecho.</p>
        
        <p><strong>EL PROMITENTE VENDEDOR:</strong> ${data.clientName}, con C.I. ${data.clientDocument}${data.clientPhone ? `, teléfono ${data.clientPhone}` : ''}${data.clientEmail ? `, email ${data.clientEmail}` : ''}, mayor de edad, hábil por derecho.</p>
      </div>

      <h2>PRIMERA: ANTECEDENTES</h2>
      <div class="section">
        <p>El PROMITENTE VENDEDOR declara ser propietario del inmueble ubicado en: <span class="data">${data.property.address}</span>${data.property.city ? `, ${data.property.city}` : ''}${data.property.zone ? `, zona ${data.property.zone}` : ''}.</p>
      </div>

      <h2>SEGUNDA: OBJETO</h2>
      <div class="section">
        <p>Por el presente contrato, el PROMITENTE COMPRADOR se compromete a adquirir el inmueble descrito, y el PROMITENTE VENDEDOR se compromete a venderlo, bajo las condiciones establecidas en este documento.</p>
      </div>

      <h2>TERCERA: PRECIO Y FORMA DE PAGO</h2>
      <div class="section">
        <p>El precio acordado es de <span class="data">$us ${data.amount}</span> (${numeroALetras(parseFloat(data.amount))} DÓLARES AMERICANOS).</p>
        <p>El pago se realizará de la siguiente manera:</p>
        <ul>
          <li>Señal: 10% a la firma del presente contrato</li>
          <li>Saldo: A la firma de la minuta de transferencia</li>
        </ul>
      </div>

      <h2>CUARTA: PLAZO</h2>
      <div class="section">
        <p>La compraventa definitiva deberá realizarse hasta el <span class="data">${data.endDate}</span>.</p>
      </div>

      ${data.notes ? `
      <h2>QUINTA: OBSERVACIONES</h2>
      <div class="section">
        <p>${data.notes}</p>
      </div>
      ` : ''}

      <div class="signatures">
        <div class="signature-box">
          <div class="signature-line"></div>
          <p><strong>${data.agentName}</strong></p>
          <p>C.I. ${data.agentDocument}</p>
          <p>PROMITENTE COMPRADOR</p>
        </div>
        <div class="signature-box">
          <div class="signature-line"></div>
          <p><strong>${data.clientName}</strong></p>
          <p>C.I. ${data.clientDocument}</p>
          <p>PROMITENTE VENDEDOR</p>
        </div>
      </div>
    </body>
    </html>
  `,

  [ContractType.ANTICRETICO]: (data: TemplateData) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 40px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .section {
          margin-bottom: 30px;
        }
        .signatures {
          margin-top: 100px;
          display: flex;
          justify-content: space-between;
        }
        .signature-box {
          text-align: center;
          width: 40%;
        }
        .signature-line {
          border-bottom: 1px solid #000;
          margin-bottom: 5px;
          height: 40px;
        }
        h1 { font-size: 24px; }
        h2 { font-size: 18px; margin-top: 30px; }
        .data { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>CONTRATO DE ANTICRÉTICO</h1>
        <p>Contrato N°: <span class="data">${data.contractNumber}</span></p>
        <p>Fecha: <span class="data">${data.currentDate}</span></p>
      </div>

      <div class="section">
        <p>Conste por el presente documento privado de CONTRATO DE ANTICRÉTICO, que celebran:</p>
        
        <p><strong>EL ACREEDOR ANTICRESISTA:</strong> ${data.clientName}, con C.I. ${data.clientDocument}${data.clientPhone ? `, teléfono ${data.clientPhone}` : ''}${data.clientEmail ? `, email ${data.clientEmail}` : ''}, mayor de edad, hábil por derecho.</p>
        
        <p><strong>EL DEUDOR ANTICRÉTICO:</strong> ${data.agentName}, con C.I. ${data.agentDocument}, mayor de edad, hábil por derecho.</p>
      </div>

      <h2>PRIMERA: OBJETO</h2>
      <div class="section">
        <p>El DEUDOR ANTICRÉTICO da en anticrético al ACREEDOR ANTICRESISTA el inmueble ubicado en: <span class="data">${data.property.address}</span>${data.property.city ? `, ${data.property.city}` : ''}${data.property.zone ? `, zona ${data.property.zone}` : ''}.</p>
      </div>

      <h2>SEGUNDA: MONTO Y PLAZO</h2>
      <div class="section">
        <p>El monto del anticrético es de <span class="data">$us ${data.amount}</span> (${numeroALetras(parseFloat(data.amount))} DÓLARES AMERICANOS).</p>
        <p>El plazo del anticrético es desde el <span class="data">${data.startDate}</span> hasta el <span class="data">${data.endDate}</span>.</p>
      </div>

      <h2>TERCERA: USO DEL INMUEBLE</h2>
      <div class="section">
        <p>El ACREEDOR ANTICRESISTA podrá usar el inmueble como vivienda, comprometiéndose a:</p>
        <ul>
          <li>Mantener el inmueble en buen estado</li>
          <li>Pagar los servicios básicos</li>
          <li>No realizar modificaciones sin autorización</li>
        </ul>
      </div>

      <h2>CUARTA: DEVOLUCIÓN</h2>
      <div class="section">
        <p>Al vencimiento del plazo, el DEUDOR ANTICRÉTICO devolverá el monto íntegro y el ACREEDOR ANTICRESISTA devolverá el inmueble.</p>
      </div>

      ${data.notes ? `
      <h2>QUINTA: OBSERVACIONES</h2>
      <div class="section">
        <p>${data.notes}</p>
      </div>
      ` : ''}

      <div class="signatures">
        <div class="signature-box">
          <div class="signature-line"></div>
          <p><strong>${data.agentName}</strong></p>
          <p>C.I. ${data.agentDocument}</p>
          <p>DEUDOR ANTICRÉTICO</p>
        </div>
        <div class="signature-box">
          <div class="signature-line"></div>
          <p><strong>${data.clientName}</strong></p>
          <p>C.I. ${data.clientDocument}</p>
          <p>ACREEDOR ANTICRESISTA</p>
        </div>
      </div>
    </body>
    </html>
  `
}
