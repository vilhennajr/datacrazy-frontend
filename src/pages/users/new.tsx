import { useCreateContactMutation } from '@/lib/contactsApi'
import { Container } from '@mui/material'
import { Formik, FormikProps } from 'formik'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import CustomForm from '../../components/Form/index'
interface IContactFormForm {
  name: string;
  email: string;
  mobile_phone: string;
}

const CreateContactForm: React.FC = () => {
  const router = useRouter()
  const [createContact] = useCreateContactMutation()

  const createNewContact = async (
    data: IContactFormForm,
    resetForm: Function
  ) => {

    data.email = data.email.toLowerCase()
    data.mobile_phone = data.mobile_phone.replace(/[^0-9]/g, '')

    const res = await createContact(data)
    if (res?.data?._id) {
      toast('Usuário criado com sucesso', {
        type: 'success',
      })
      resetForm()
      return router.push('/')
    }

    if (res.error) {
      toast(res?.error?.data?.message, {
        type: 'error',
      })
    }
  }

  return (
    <>
      <Head key='head'>
        <title>CRM - DataCrazy</title>
        <meta name='description' content='Criar Usuário' />
      </Head>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '0 0.5rem',
          marginTop: 5,
        }}
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            name: '',
            email: '',
            mobile_phone: ''
          }}
          onSubmit={(values: IContactFormForm, actions) => {
            createNewContact(values, actions.resetForm)
            setTimeout(() => {
              actions.setSubmitting(false)
            }, 500)
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Por favor, insira o nome'),
            email: Yup.string().email().required('Insira um e-mail válido'),
            mobile_phone: Yup.string().required('Por favor, insira o número de telefone')
          })}
        >
          {(props: FormikProps<IContactFormForm>) => {
            return <CustomForm {...props} title='Criar' />
          }}
        </Formik>
      </Container>
    </>
  )
}

export default CreateContactForm
