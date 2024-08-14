
'use client'
import React, { use, useState } from 'react'
import Image from "next/image"
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from './ui/textarea';
import ReactDatePicker from 'react-datepicker';
import { Input } from './ui/input'
import { link } from 'fs'


const MeetingTypeList = () => {

    const router = useRouter();
    const [meetingState, setmeetingState] = useState <'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();

    const {user} = useUser();
    const client = useStreamVideoClient();
    const [values, setValues] = useState({
        dateTime: new Date(),
        description: '',
        link:'',
    })
    const [callDetails, setcallDetails] = useState<Call>()
    const { toast } = useToast()
    const createMeeting = async () => {

        if(!client || !user) return;

        try {

            if(!values.dateTime){
                toast({title: "Selecciona una fecha y hora"})
                return;
            }

            const id = crypto.randomUUID();
            const call = client.call('default', id);

            if (!call) throw new Error('Fallo al crear la reunión')

            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || 'Reunión rápida';

            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description
                    }
                }
            })
        setcallDetails(call);

        if(!values.description) {
            router.push(`/meeting/${call.id}`)
        }

        toast({title: "Reunión creada"})
        } catch (error) {
            console.log(error);
            toast({
                title: "Fallo al crear la reunión"
              })
        }
    }

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`
    

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        <HomeCard 
            img="/icons/add-meeting.svg"
            title="Nueva reunión"
            description="Empieza una reunión al instante"
            handleClick={() => setmeetingState('isInstantMeeting')}
            className="bg-orange-1"
            />
        <HomeCard 
            img="/icons/schedule.svg"
            title="Agendar reunión"
            description="Define una fecha y hora para una nueva reunión"
            handleClick={() => setmeetingState('isScheduleMeeting')}
            className="bg-blue-1"
        />
        <HomeCard 
            img="/icons/join-meeting.svg"
            title="Únete a una reunión"
            description="Unete a una reunión con un enlace de invitación"
            handleClick={() => setmeetingState('isJoiningMeeting')}
            className="bg-purple-1"
        />

        <HomeCard 
            img="/icons/recordings.svg"
            title="Ver grabaciones"
            description="Revisa tus grabaciones"
            handleClick={() => router.push('/recordings')}
            className="bg-yellow-1"
        />

        {!callDetails ? (
            <MeetingModal
                isOpen={meetingState === 'isScheduleMeeting'}
                onClose = {() => setmeetingState(undefined)}
                title="Agenda una Reunión"
                handleClick={createMeeting}
            >
                <div className='flex flex-col gap-2.5'>
                    <label className='text-base text-normal leading-[22px] text-sky-1'>Añade una descripción</label>
                    <Textarea className='border-none bg-dark-2 focus-visible:ring-0 focus-visible-ring-offset-0' onChange={(e) => {
                        setValues({...values, description: e.target.value})
                    }}/>
                </div>
                <div className='flex w-full flex-col gap-2.5'>
                    <label className='text-base text-normal leading-[22px] text-sky-1'>Selecciona fecha y hora</label>
                    <ReactDatePicker 
                    
                    selected={values.dateTime}
                    onChange={(date) => setValues({...values, dateTime: date!})}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Hora"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className='w-full rounded bg-dark-2 p-2 focus:outline-none'
                    />
                </div>
            </MeetingModal>
        ) : (
            <MeetingModal
                isOpen={meetingState === 'isScheduleMeeting'}
                onClose = {() => setmeetingState(undefined)}
                title="Reunión agendada"
                className="text-center"
                handleClick={() => {
                   navigator.clipboard.writeText(meetingLink);
                    toast({title: 'Link copiado'})
                }}
                image='/icons/checked.svg'
                buttonIcon='/icons/copy.svg'
                buttonText='Copiar enlace a la reunión'
        />
        )}
        <MeetingModal
            isOpen={meetingState === 'isInstantMeeting'}
            onClose = {() => setmeetingState(undefined)}
            title="Comienza una reunión de inmediato"
            className="text-center"
            buttonText="Comenzar reunión"
            handleClick={createMeeting}
        />

        <MeetingModal
            isOpen={meetingState === 'isJoiningMeeting'}
            onClose = {() => setmeetingState(undefined)}
            title="Escribe o pega el enlace aquí"
            className="text-center"
            buttonText="Unete a una reunión"
            handleClick={() => router.push(values.link)}>
                <Input placeholder='Enlace a la reunión' className='border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0'
                onChange={(e) => setValues({ ...values, link: e.target.value })} />
            </MeetingModal>
    </section>
  )
}

export default MeetingTypeList