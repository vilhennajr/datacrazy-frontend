import { Box, Button, FormControl, TextField, Typography } from '@mui/material'
import { Form } from 'formik'
import { useRouter } from 'next/router'
import React from 'react'

interface Props {
  values: any
  errors: any
  touched: any
  handleChange: any
  handleBlur: any
  isSubmitting: any
  title: string
}

const CustomForm: React.FC<Props> = (props: Props) => {
  const router = useRouter()
  const { values, errors, touched, handleChange, handleBlur, isSubmitting } =
    props

  const hasError = Object.keys(errors).length > 0

  return (
    <Form>
      <Box
        sx={{
          background: '#fff',
          padding: '1.5rem 1.25rem 2.5rem',
          width: '100%',
          maxWidth: '400px',
          minWidth: '300px',
          borderRadius: '1rem',
        }}
      >
        <Typography
          component='h1'
          fontWeight={600}
          fontSize={24}
          sx={{ margin: '0 auto 1.5rem', textAlign: 'left' }}
        >
          {props.title} Usuário
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 2.25,
            width: '100%',
            maxWidth: '400px',
          }}
        >
          <FormControl>
            <TextField
              name='name'
              id='name'
              label='Nome'
              value={values.name}
              type='text'
              error={errors.name && touched.name ? true : false}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && touched.name && (
              <div style={{ color: 'red' }}>{errors.name}</div>
            )}
          </FormControl>

          <FormControl>
            <TextField
              name='email'
              id='email'
              label='E-mail'
              value={values.email}
              type='email'
              error={errors.email && touched.email ? true : false}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email && (
              <div style={{ color: 'red' }}>{errors.email}</div>
            )}
          </FormControl>

          <FormControl>
            <TextField
              name='mobile_phone'
              id='mobile_phone'
              label='Telefone'
              value={values.mobile_phone}
              type='text'
              error={errors.mobile_phone && touched.mobile_phone ? true : false}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.mobile_phone && touched.mobile_phone && (
              <div style={{ color: 'red' }}>{errors.mobile_phone}</div>
            )}
          </FormControl>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              type='button'
              variant='outlined'
              color='inherit'
              size='large'
              disabled={isSubmitting}
              sx={{
                cursor: `${hasError ? 'not-allowed' : 'default'}`,
              }}
              title={hasError ? 'Please fill all the fields' : ''}
              fullWidth
              onClick={() => {
                router.back()
              }}
            >
              <Typography
                variant='button'
                fontSize={20}
                fontWeight={600}
                textTransform='capitalize'
              >
                Cencelar
              </Typography>
            </Button>

            <Button
              type='submit'
              variant={'contained'}
              color={hasError ? 'error' : 'primary'}
              size='large'
              disabled={isSubmitting}
              sx={{
                cursor: `${hasError ? 'not-allowed' : 'default'}`,
              }}
              title={hasError ? 'Please fill all the fields' : ''}
              fullWidth
            >
              <Typography
                variant='button'
                fontSize={20}
                fontWeight={600}
                textTransform='capitalize'
              >
                {props.title}
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </Form>
  )
}

export default CustomForm
