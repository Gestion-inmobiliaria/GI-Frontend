import { toast } from 'sonner'
import { useState } from 'react'
import { useHeader } from '@/hooks'
import { Button } from '@/components/ui/button'
import { API_BASEURL, ENDPOINTS } from '@/utils/api.utils'



const UploadExcelPage = (): JSX.Element => {
    useHeader([{ label: 'Registro masivo de Inmuebles' }])
    const [file, setFile] = useState<File | null>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0])
        }
    }

    const handleUpload = async () => {
        if (!file) {
            toast.error('Por favor, selecciona un archivo.')
            return
        }

        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch(`${API_BASEURL}${ENDPOINTS.UPLOAD_EXCEL}`, {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                toast.success('Archivo subido exitosamente.')
            } else {
                toast.error('Error al subir el archivo.')
            }
        } catch (error) {
            toast.error('Ocurrió un error al subir el archivo.')
        }
    }

    return (
        <section className="p-4">
            <h1 className="text-2xl font-bold mb-4">Registro masivo de Inmuebles</h1>
            <div className="flex flex-col gap-4">
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="border p-2"
                />
                <Button onClick={handleUpload} disabled={!file}>
                    Subir archivo
                </Button>
            </div>
        </section>
    )
}

export default UploadExcelPage
