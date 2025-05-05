'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import AccountTypeStep from './components/account-type-step'
import PersonalInfoStep from './components/personal-info-step'
import ProviderTypeStep from './components/provider-type-step'
import SpecialtyStep from './components/specialty-step'
import AddressStep from './components/address-step'
import PlanSelectionStep from './components/plan-selection-step'
import ReviewStep from './components/review-step'
import SignupSidePanel from './components/signup-side-panel'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Plan } from '../dashboard/plans/services/plans'
import CompanyFormStep from './components/company-form-step'
import {
  formatDocument,
  validateCNPJ,
  validateCPF,
  validateZipCode,
} from './utils/signup-utils'
import { format } from 'date-fns'
import { PaymentFlow } from '../dashboard/payment/components/payment-flow'
import { se } from 'date-fns/locale'

export default function SignupForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    document: '',
    userType: 'CLIENT', // Default to CLIENT
    providerType: '', // INDIVIDUAL or TEAM
    documentType: 'CPF', // Default to CPF
    terms: false,
    // Campos para PJ (Provider TEAM)
    companyName: '',
    companyType: undefined as 'mei' | 'me' | 'epp' | undefined,
    tradeName: '',
    legalRepresentative: '',
    legalRepresentativeDocument: '',
    companyPhone: '',
    companyDescription: '',
    foundationDate: undefined as Date | undefined,
    // Campos de endereço (Provider)
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil',
    complement: '',
    // Campos de especialidade (Provider)
    specialty: '',
    customSpecialty: '',
  })
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)
  const [loadingPlans, setLoadingPlans] = useState(false)
  const [plans, setPlans] = useState<Plan[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [loadingCities, setLoadingCities] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showPaymentFlow, setShowPaymentFlow] = useState(false)
  // const [paymentFlowData, setPaymentFlowData] = useState({
  //   clientSecret: '',
  //   subscriptionId: '',
  // })

  const getTotalSteps = () => {
    if (formData.userType === 'CLIENT') {
      return 3 // Account Type, Personal Info
    }
    // Provider
    if (formData.providerType === 'TEAM') {
      return 6 // Account Type, Provider Type, Company, Address, Specialty, Plan, Review
    }
    // Provider Individual
    return 5 // Account Type, Provider Type, Personal Info, Specialty, Address, Plan, Review
  }

  useEffect(() => {
    const totalSteps = getTotalSteps()
    setProgress(Math.max(0, ((currentStep - 1) / (totalSteps - 1)) * 100)) // Calculate progress based on current step and total steps
  }, [currentStep, formData.userType, formData.providerType])

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}plans`)
        if (!response.ok) {
          throw new Error('Falha ao carregar planos')
        }
        const data = await response.json()
        setPlans(data)
      } catch (error) {
        toast.error('Falha ao carregar planos')
        console.error('Error fetching plans:', error)
      } finally {
        setLoadingPlans(false)
      }

      setSelectedPlanId(1)
    }

    const planStepNumber =
      formData.providerType === 'TEAM'
        ? 6
        : formData.userType === 'PROVIDER'
        ? 6
        : -1
    if (formData.userType === 'PROVIDER' && currentStep === planStepNumber) {
      fetchPlans()
    }
  }, [formData.userType, formData.providerType, currentStep])

  const fetchCitiesByState = async (uf: string) => {
    if (!uf) return
    try {
      setLoadingCities(true)
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
      )
      if (!response.ok) {
        throw new Error('Falha ao carregar cidades')
      }
      const data = await response.json()
      const cityNames = data.map((city: any) => city.nome).sort()
      setCities(cityNames)
    } catch (error) {
      toast.error('Falha ao carregar cidades')
      console.error('Erro ao buscar cidades:', error)
    } finally {
      setLoadingCities(false)
    }
  }

  const fetchAddressByZipCode = async (zipCode: string) => {
    const cleanedZipCode = zipCode.replace(/\D/g, '')
    if (cleanedZipCode.length !== 8) return

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanedZipCode}/json/`
      )
      if (!response.ok) throw new Error('CEP não encontrado')
      const data = await response.json()
      if (data.erro) throw new Error('CEP não encontrado')

      setFormData((prev) => ({
        ...prev,
        street: data.logradouro || prev.street,
        city: data.localidade || prev.city,
        state: data.uf || prev.state,
        // neighborhood: data.bairro || prev.neighborhood,
      }))

      if (data.uf) {
        fetchCitiesByState(data.uf)
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
      toast.error('Não foi possível encontrar o endereço para este CEP')
      // setFormData((prev) => ({
      //   ...prev,
      //   street: '',
      //   city: '',
      //   state: '',
      // }))
    }
  }

  // Centralized validation logic
  const validateStep = (step: number): boolean => {
    setErrors({})
    const newErrors: { [key: string]: string } = {}
    let isValid = true

    // Step 1: Account Type (All users)
    if (step === 1) {
      if (!formData.userType) {
        newErrors.userType = 'Selecione o tipo de conta'
        isValid = false
      }
    }

    if (formData.userType === 'CLIENT') {
      // Step 2: Personal Info (Client)
      if (step === 2) {
        if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório'
        if (!formData.email.trim()) {
          newErrors.email = 'Email é obrigatório'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email inválido'
        }
        if (!formData.password) {
          newErrors.password = 'Senha é obrigatória'
        } else if (formData.password.length < 8) {
          newErrors.password = 'A senha deve ter pelo menos 8 caracteres'
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'As senhas não coincidem'
        }
        if (!formData.document) {
          newErrors.document = 'CPF é obrigatório'
        } else if (!validateCPF(formData.document)) {
          newErrors.document = 'CPF inválido'
        }
        if (!formData.terms) newErrors.terms = 'Você deve aceitar os termos'

        if (Object.keys(newErrors).length > 0) isValid = false
      }
    }

    if (formData.userType === 'PROVIDER') {
      // Step 2: Provider Type
      if (step === 2) {
        if (!formData.providerType) {
          newErrors.providerType = 'Selecione o tipo de prestador'
          isValid = false
        }
      }

      if (formData.providerType === 'INDIVIDUAL') {
        // Step 3: Personal Info (Provider Individual)
        if (step === 3) {
          if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório'
          if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório'
          } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido'
          }
          if (!formData.password) {
            newErrors.password = 'Senha é obrigatória'
          } else if (formData.password.length < 8) {
            newErrors.password = 'A senha deve ter pelo menos 8 caracteres'
          }
          if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem'
          }
          if (!formData.document) {
            newErrors.document = 'Documento (CPF/CNPJ) é obrigatório'
          } else {
            if (
              formData.documentType === 'CPF' &&
              !validateCPF(formData.document)
            ) {
              newErrors.document = 'CPF inválido'
            } else if (
              formData.documentType === 'CNPJ' &&
              !validateCNPJ(formData.document)
            ) {
              newErrors.document = 'CNPJ inválido'
            }
          }
          if (!formData.terms) newErrors.terms = 'Você deve aceitar os termos'

          if (Object.keys(newErrors).length > 0) isValid = false
        }
        // Step 4: Specialty (Provider Individual)
        if (step === 4) {
          if (!formData.specialty) {
            newErrors.specialty = 'Área de atuação é obrigatória'
          } else if (
            formData.specialty === 'Outro' &&
            !formData.customSpecialty.trim()
          ) {
            newErrors.customSpecialty = 'Especifique sua área de atuação'
          }
          if (Object.keys(newErrors).length > 0) isValid = false
        }
        // Step 5: Address (Provider Individual)
        if (step === 5) {
          if (!formData.zipCode) {
            newErrors.zipCode = 'CEP é obrigatório'
          } else if (!validateZipCode(formData.zipCode)) {
            newErrors.zipCode = 'CEP inválido'
          }
          if (!formData.street.trim())
            newErrors.street = 'Endereço é obrigatório'
          if (!formData.state) newErrors.state = 'Estado é obrigatório'
          if (!formData.city) newErrors.city = 'Cidade é obrigatória'
          // Add validation for other address fields if they become mandatory
          if (Object.keys(newErrors).length > 0) isValid = false
        }
        // Step 6: Plan (Provider Individual)
        if (step === 6) {
          if (!selectedPlanId) {
            newErrors.plan = 'Selecione um plano para continuar'
            isValid = false
          }
        }
      }

      // --- PROVIDER TEAM Validation ---
      if (formData.providerType === 'TEAM') {
        // Step 3: Company Info (Provider Team)
        if (step === 3) {
          if (!formData.companyName.trim())
            newErrors.companyName = 'Razão Social é obrigatória'
          if (!formData.document) {
            newErrors.document = 'CNPJ é obrigatório'
          } else if (!validateCNPJ(formData.document)) {
            newErrors.document = 'CNPJ inválido'
          }
          if (!formData.companyType)
            newErrors.companyType = 'Selecione o tipo de empresa'
          if (!formData.legalRepresentative.trim())
            newErrors.legalRepresentative = 'Responsável legal é obrigatório'
          if (!formData.legalRepresentativeDocument) {
            newErrors.legalRepresentativeDocument =
              'CPF do responsável é obrigatório'
          } else if (!validateCPF(formData.legalRepresentativeDocument)) {
            newErrors.legalRepresentativeDocument = 'CPF inválido'
          }
          if (!formData.foundationDate)
            newErrors.foundationDate = 'Data de fundação é obrigatória'
          if (!formData.companyPhone.trim())
            newErrors.companyPhone = 'Telefone comercial é obrigatório'
          // Add validation for email/password if collected here
          if (!formData.email.trim()) {
            // Assuming email/pass collected here for team admin
            newErrors.email = 'Email do responsável é obrigatório'
          } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido'
          }
          if (!formData.password) {
            newErrors.password = 'Senha é obrigatória'
          } else if (formData.password.length < 8) {
            newErrors.password = 'A senha deve ter pelo menos 8 caracteres'
          }
          if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem'
          }
          if (!formData.terms) newErrors.terms = 'Você deve aceitar os termos'

          if (Object.keys(newErrors).length > 0) isValid = false
        }
        // Step 4: Address (Provider Team)
        if (step === 4) {
          if (!formData.zipCode) {
            newErrors.zipCode = 'CEP é obrigatório'
          } else if (!validateZipCode(formData.zipCode)) {
            newErrors.zipCode = 'CEP inválido'
          }
          if (!formData.street.trim())
            newErrors.street = 'Endereço é obrigatório'
          if (!formData.state) newErrors.state = 'Estado é obrigatório'
          if (!formData.city) newErrors.city = 'Cidade é obrigatória'
          if (Object.keys(newErrors).length > 0) isValid = false
        }
        // Step 5: Specialty (Provider Team)
        if (step === 5) {
          if (!formData.specialty) {
            newErrors.specialty = 'Área de atuação é obrigatória'
          } else if (
            formData.specialty === 'Outro' &&
            !formData.customSpecialty.trim()
          ) {
            newErrors.customSpecialty = 'Especifique sua área de atuação'
          }
          if (Object.keys(newErrors).length > 0) isValid = false
        }
        // Step 6: Plan (Provider Team)
        if (step === 6) {
          if (!selectedPlanId) {
            newErrors.plan = 'Selecione um plano para continuar'
            isValid = false
          }
        }
      }
    }

    setErrors(newErrors)
    if (!isValid) {
      // Optionally show a general error toast
      // toast.error('Por favor, corrija os erros no formulário.')
      console.log('Validation errors:', newErrors)
    }
    return isValid
  }

  // Determine the next step based on current step and user/provider type
  const getNextStep = (step: number): number => {
    const totalSteps = getTotalSteps()
    if (step >= totalSteps) return step // Already at the last step (Review)

    if (formData.userType === 'CLIENT') {
      return step === 1 ? 2 : totalSteps // Step 1 -> 2 (Personal Info), Step 2 -> Review (which is totalSteps)
    }

    // Provider Flow
    if (formData.providerType === 'TEAM') {
      // 1:AccType -> 2:ProvType -> 3:Company -> 4:Address -> 5:Specialty -> 6:Plan -> 7:Review
      return step + 1
    } else {
      // INDIVIDUAL
      // 1:AccType -> 2:ProvType -> 3:PersonalInfo -> 4:Specialty -> 5:Address -> 6:Plan -> 7:Review
      // Note: The actual last step number is 7 (Review), but the flow has 6 steps before review
      if (step === 6) return 7 // Plan -> Review
      return step + 1
    }
  }

  // Determine the previous step
  const getPreviousStep = (step: number): number => {
    if (step <= 1) return 1 // Cannot go before step 1

    if (formData.userType === 'CLIENT') {
      return 1 // From Personal Info (2) or Review back to Account Type (1)
    }

    // Provider Flow (handles both TEAM and INDIVIDUAL)
    return step - 1
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      const nextStep = getNextStep(currentStep)
      setCurrentStep(nextStep)
    } else {
      // Errors are set in validateStep, potentially show a toast
      toast.error('Verifique os campos marcados em vermelho.')
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(getPreviousStep(currentStep))
  }

  const getStepTitle = (step: number): string => {
    if (formData.userType === 'CLIENT') {
      switch (step) {
        case 1:
          return 'Tipo de Conta'
        case 2:
          return 'Informações Pessoais'
        default:
          return 'Revisão'
      }
    }

    // Provider Flow
    if (formData.providerType === 'TEAM') {
      switch (step) {
        case 1:
          return 'Tipo de Conta'
        case 2:
          return 'Tipo de Prestador'
        case 3:
          return 'Informações da Empresa'
        case 4:
          return 'Endereço Comercial'
        case 5:
          return 'Área de Atuação'
        case 6:
          return 'Seleção de Plano'
        case 7:
          return 'Revisão e Pagamento'
        default:
          return 'Cadastro'
      }
    } else {
      // INDIVIDUAL
      switch (step) {
        case 1:
          return 'Tipo de Conta'
        case 2:
          return 'Tipo de Prestador'
        case 3:
          return 'Informações Pessoais'
        case 4:
          return 'Área de Atuação'
        case 5:
          return 'Endereço Profissional'
        case 6:
          return 'Seleção de Plano'
        case 7:
          return 'Revisão e Pagamento'
        default:
          return 'Cadastro'
      }
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    // if (!validateStep(currentStep)) { // Assuming currentStep is Review step
    //   toast.error('Por favor, revise os dados antes de enviar.')
    //   return
    // }

    setIsLoading(true)

    const formattedFoundationDate = formData.foundationDate
      ? format(formData.foundationDate, 'yyyy-MM-dd')
      : null

    try {
      let response
      let requestData

      if (formData.userType === 'CLIENT') {
        requestData = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          type: 'CLIENT',
          documentType: 'CPF', // Client is always CPF
          document: formatDocument(formData.document),
          terms: formData.terms,
          // No address, specialty, plan for client registration
        }

        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}auth/register`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData),
          }
        )
      } else {
        // PROVIDER (Team or Individual)
        requestData = {
          email: formData.email,
          password: formData.password,
          name:
            formData.providerType === 'TEAM'
              ? formData.legalRepresentative
              : formData.name,
          type: 'PROVIDER',
          providerType: formData.providerType,
          documentType:
            formData.providerType === 'TEAM' ? 'CNPJ' : formData.documentType, // CNPJ for Team, CPF/CNPJ for Individual
          document: formatDocument(formData.document),
          terms: formData.terms,
          specialty:
            formData.specialty === 'Outro'
              ? formData.customSpecialty
              : formData.specialty,
          planId: selectedPlanId,
          address: {
            street: formData.street,
            complement: formData.complement || '',
            city: formData.city,
            state: formData.state,
            zip: formatDocument(formData.zipCode),
            // Add number and neighborhood if needed
          },
          // Team specific fields
          ...(formData.providerType === 'TEAM'
            ? {
                companyName: formData.companyName,
                tradeName: formData.tradeName || '',
                companyType: formData.companyType,
                legalRepresentative: formData.legalRepresentative,
                legalRepresentativeDocument: formatDocument(
                  formData.legalRepresentativeDocument
                ),
                foundationDate: formattedFoundationDate,
                companyPhone: formatDocument(formData.companyPhone),
                companyDescription: formData.companyDescription || '',
              }
            : {}),
          // Individual specific fields (already covered by base fields like name, document)
        }

        response = await fetch(
          // Use the correct endpoint based on provider type if necessary, or a single endpoint handling both
          `${process.env.NEXT_PUBLIC_API_URL}company/register/provider`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData),
          }
        )
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.message || 'Erro ao processar cadastro. Tente novamente.'
        )
      }

      // --- Post-Registration Actions ---

      // 1. Attempt to activate the account (common for both client/provider)
      try {
        const activateResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}auth/reactivate`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email }),
          }
        )
        if (!activateResponse.ok) {
          // Log error but don't necessarily block the user if activation fails here
          console.warn(
            'Falha ao tentar reativar a conta automaticamente:',
            await activateResponse.text()
          )
          // Maybe show a specific toast? toast.info('Verifique seu email para ativar a conta.')
        } else {
          console.log('Conta ativada/reativada com sucesso.')
        }
      } catch (activationError) {
        console.error(
          'Erro durante a tentativa de reativação:',
          activationError
        )
      }

      // 2. Handle based on user type
      if (formData.userType === 'CLIENT') {
        toast.success(
          'Cadastro de cliente realizado com sucesso! Faça login para continuar.'
        )
        router.push('/login')
      } else {
        // PROVIDER
        // Provider needs payment flow after registration
        toast.info('Cadastro inicial realizado. Prosseguindo para o pagamento.')

        // 3. Login automatically to get token for payment flow
        try {
          const loginResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}auth/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: formData.email,
                password: formData.password, // Use the submitted password
              }),
            }
          )

          if (!loginResponse.ok) {
            throw new Error('Falha no login automático pós-cadastro.')
          }

          const loginData = await loginResponse.json()
          if (loginData.access_token) {
            localStorage.setItem('access_token', loginData.access_token)
            console.log(
              'Login automático bem-sucedido, iniciando fluxo de pagamento.'
            )
            setShowPaymentFlow(true) // Trigger payment flow UI
          } else {
            throw new Error('Token de acesso não recebido após login.')
          }
        } catch (loginError: any) {
          console.error('Erro no login automático:', loginError)
          toast.error(
            `Cadastro realizado, mas houve um erro ao iniciar o pagamento: ${loginError.message}. Por favor, faça login e acesse a área de planos.`
          )
          router.push('/login') // Redirect to login even if payment flow fails
        }
      }
    } catch (error: any) {
      toast.error(`Erro no cadastro: ${error.message}`)
      console.error('Erro no cadastro:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Callback after successful payment
  const handlePaymentComplete = () => {
    toast.success('Pagamento realizado e assinatura ativada com sucesso!')
    localStorage.removeItem('access_token')
    // Redirect to dashboard
    router.push('/dashboard')
  }

  // Render Payment Flow if triggered
  if (showPaymentFlow) {
    return (
      <div className='min-h-screen bg-background'>
        <Header />
        <main className='container mx-auto px-4 py-6'>
          <PaymentFlow
            onComplete={handlePaymentComplete}
            initialPlan={plans.find((plan) => plan.id === selectedPlanId)} // Pass selected plan
            // Pass clientSecret and subscriptionId if needed by PaymentFlow
          />
        </main>
        <Footer />
      </div>
    )
  }

  // Dynamically render the current step component
  const getStepComponent = () => {
    const totalSteps = getTotalSteps()

    // Review Step (always the last step)
    if (currentStep === totalSteps) {
      return (
        <ReviewStep
          formData={formData}
          selectedPlanId={selectedPlanId}
          plans={plans}
          onSubmit={handleSubmit}
        />
      )
    }

    // Other steps based on user type and provider type
    switch (currentStep) {
      case 1:
        return (
          <AccountTypeStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        )
      // --- Client Flow ---
      case 2:
        if (formData.userType === 'CLIENT') {
          return (
            <PersonalInfoStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )
        } else {
          // Provider Flow starts here
          return (
            <ProviderTypeStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )
        }
      // --- Provider Flow (Individual & Team) ---
      case 3:
        return formData.providerType === 'TEAM' ? (
          <CompanyFormStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        ) : (
          // INDIVIDUAL
          <PersonalInfoStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        )
      case 4:
        if (formData.providerType === 'TEAM') {
          return (
            <AddressStep
              formData={formData}
              setFormData={setFormData}
              loadingCities={loadingCities}
              cities={cities}
              fetchCitiesByState={fetchCitiesByState}
              fetchAddressByZipCode={fetchAddressByZipCode}
              errors={errors}
            />
          )
        } else {
          // INDIVIDUAL
          return (
            <SpecialtyStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )
        }
      case 5:
        if (formData.providerType === 'TEAM') {
          return (
            <SpecialtyStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )
        } else {
          // INDIVIDUAL
          return (
            <AddressStep
              formData={formData}
              setFormData={setFormData}
              loadingCities={loadingCities}
              cities={cities}
              fetchCitiesByState={fetchCitiesByState}
              fetchAddressByZipCode={fetchAddressByZipCode}
              errors={errors}
            />
          )
        }
      default:
        // Fallback to first step if something goes wrong
        return (
          <AccountTypeStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        )
    }
  }

  const totalSteps = getTotalSteps()
  const isLastStepBeforeReview = currentStep === totalSteps - 1
  const isReviewStep = currentStep === totalSteps

  return (
    <main className='min-h-screen flex flex-col'>
      <Header />
      <div className='flex-grow container max-w-7xl mx-auto px-4 py-8 md:py-12'>
        {/* Progress Bar */}
        <div className='max-w-xl mx-auto mb-8'>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Etapa {currentStep} de {totalSteps}: {getStepTitle(currentStep)}
            </span>
            <span className='text-sm font-medium text-blue-600 dark:text-blue-400'>
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className='h-2' />
        </div>

        {/* Main Content Area */}
        <div className='grid md:grid-cols-3 gap-8 lg:gap-12 items-start'>
          {/* Form Section */}
          <motion.div
            className='md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Animated Step Component */}
            <AnimatePresence mode='wait'>{getStepComponent()}</AnimatePresence>

            {/* Navigation Buttons (Don't show on Review Step if handled inside) */}
            {!isReviewStep && (
              <div className='flex gap-4 mt-8'>
                {currentStep > 1 && (
                  <Button
                    type='button'
                    onClick={handlePrevStep}
                    variant='outline'
                    className='flex-1 h-11 md:h-12'
                    disabled={isLoading}
                  >
                    <ChevronLeft className='mr-2 h-4 w-4' />
                    Voltar
                  </Button>
                )}
                <Button
                  type='button'
                  onClick={handleNextStep}
                  className='flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 h-11 md:h-12'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Processando...
                    </>
                  ) : (
                    <>
                      {isLastStepBeforeReview ? 'Revisar Dados' : 'Próximo'}
                      <ChevronRight className='ml-2 h-4 w-4' />
                    </>
                  )}
                </Button>
              </div>
            )}
          </motion.div>

          {/* Side Panel */}
          <div className='hidden md:block md:col-span-1'>
            <SignupSidePanel />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

