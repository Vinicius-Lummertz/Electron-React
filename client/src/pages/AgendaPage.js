import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { useAgenda } from '../context/AgendaContext';

export default function AgendaPage() {
  const { atendimentos, openContextMenu } = useAgenda();

  // A função de transformação continua a mesma
  const transformEventData = (eventInfo) => {
    return {
      id: eventInfo.id,
      title: `${eventInfo.cliente_nome}`,
      start: eventInfo.data_hora_inicio,
      end: eventInfo.data_hora_fim,
      extendedProps: {
        servico: eventInfo.servico_descricao,
        profissional: eventInfo.profissional_nome,
        status: eventInfo.status,
      }
    };
  };
  
  // AQUI A CORREÇÃO: Passamos o objeto de data (`clickInfo.date`) em vez do texto
  const handleDayCellMount = (mountInfo) => {
    const { el, date } = mountInfo;
    
    el.addEventListener('contextmenu', (jsEvent) => {
      
      jsEvent.preventDefault(); // Impede o menu padrão do navegador
      
      // Abre nosso menu customizado na posição do mouse
      openContextMenu({ top: jsEvent.clientY, left: jsEvent.clientX }, date);
    });
  };

  const transformedEvents = atendimentos.map(transformEventData);

  return (
    <div className='h-full'>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={ptBrLocale}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
        // AQUI A OTIMIZAÇÃO: O calendário agora lê os eventos do nosso estado central
        events={transformedEvents}
        height="85vh"
        eventColor='#6d28d9'
        dayCellDidMount={handleDayCellMount} // << NOSSA NOVA LÓGICA

        // A propriedade que causava o warning foi removida
      />
    </div>
  );
}