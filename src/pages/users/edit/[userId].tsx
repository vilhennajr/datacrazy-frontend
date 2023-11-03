import CustomForm from '@/components/Form'
import {
  useGetContactDetailsQuery,
  useUpdateContactMutation,
} from '@/lib/contactsApi'
import { Container } from '@mui/material'
import { Formik, FormikProps } from 'formik'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

interface IContactForm {
  name: string;
  email: string;
  mobile_phone: string;
}

const UpdateContactForm: React.FC = () => {
  const router = useRouter()
  const { userId } = router.query
  const [initialData, setInitialData] = React.useState<IContactForm>({
    name: '',
    email: '',
    mobile_phone: ''
  })

  const { data, isFetching } = useGetContactDetailsQuery(
    {
      id: userId,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !userId,
    }
  )
  const [updateContact] = useUpdateContactMutation()

  const updateContactHandler = async (
    data: IContactForm,
    resetForm: Function
  ) => {
    if (
      initialData.name === data?.name &&
      initialData.email === data?.email &&
      initialData.mobile_phone === data?.mobile_phone
    ) {
      toast('No changes made', {
        type: 'info',
      })
      return
    }

    const res = await updateContact({ _id: userId, data })

    if (res?.data?._id) {
      router.push('/').then(() => {
        toast('Usuário atualizado com sucesso', {
          type: 'success',
        })
      })
      return
    }

    if (res.error) {
      toast(res?.error?.data?.message, {
        type: 'error',
      })
      return
    }

    toast('Something went wrong', {
      type: 'error',
    })
  }

  React.useEffect(() => {
    if (data) {
      setInitialData({
        name: data?.name,
        email: data?.email,
        mobile_phone: data?.mobile_phone
      })
    }
  }, [])

  return (
    <>
      <Head>
        <title>CRM - DataCrazy</title>
        <meta name='description' content='Atualizar Usuário' />
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
            name: data?.name,
            email: data?.email,
            mobile_phone: data?.mobile_phone
          }}
          onSubmit={(values: IContactForm, actions) => {
            updateContactHandler(values, actions.resetForm)
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
          {(props: FormikProps<IContactForm>) => {
            if (!isFetching) {
              return (
                <>
                  <CustomForm {...props} title='Atualizar' />
                </>
              )
            }
          }}
        </Formik>
      </Container>
    </>
  )
}

export default UpdateContactForm
