import { MdChatBubbleOutline } from 'react-icons/md';
import { RiQuestionLine } from 'react-icons/ri';
import { FiUser } from 'react-icons/fi';
import { BsPersonBadge } from 'react-icons/bs';
import ResponseForm from './ResponseForm';
import ProfessionalInfo from './ProfessionalInfo';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const QuestionContent = ({ data, user }) => {
  const { _id, text, answer, isAnswered, creator, userId, createdDate } = data;
  const professional = answer?.professional || null;

  const creatorName = creator
    ? `${creator.firstname} ${creator.lastname}`
    : 'Usuario anónimo';
  const creatorInitial = creator ? creator.firstname[0].toUpperCase() : 'U';
  const creatorImage = creator?.image || null;

  const professionalName = professional
    ? `Dr. ${professional.firstname} ${professional.lastname}`
    : null;
  const professionalInitial = professional ? professional.firstname[0].toUpperCase() : 'P';
  const professionalImage = professional?.image || null;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
      <div className="w-full flex flex-col gap-3 min-w-0">
        {/* Header: avatar, nombre, fecha y badge de estado */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2.5">
            {creatorImage ? (
              <img
                src={creatorImage}
                alt={creatorName}
                className="size-9 shrink-0 rounded-full object-cover select-none"
              />
            ) : (
              <div className="size-9 shrink-0 rounded-full bg-primary-100 text-primary-700 font-bold text-sm flex items-center justify-center select-none">
                {creatorInitial}
              </div>
            )}
            <div className="leading-tight">
              <p className="text-sm font-semibold text-secondary-700 flex items-center gap-1">
                <FiUser size={13} className="text-secondary-400" />
                {creatorName}
              </p>
              {createdDate && (
                <p className="text-xs text-secondary-400">{formatDate(createdDate)}</p>
              )}
            </div>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 tracking-wide ${isAnswered
              ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
              : 'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
              }`}
          >
            {isAnswered ? '✓ Respondida' : '⏳ Sin respuesta'}
          </span>
        </div>

        {/* Texto de la pregunta */}
        <div className="break-words text-secondary-800 bg-gray-50 border border-gray-100 rounded-md px-3 py-2.5">
          <RiQuestionLine size={17} className="text-primary-500 inline mr-1.5 shrink-0" />
          <span className="text-sm leading-relaxed">{text}</span>
        </div>

        {/* Respuesta o formulario */}
        {isAnswered ? (
          <div className="flex flex-col gap-1.5">
            <div className="break-words bg-primary-50 border-l-4 border-primary-400 pl-3 pr-2 py-2.5 rounded-r-md">
              <MdChatBubbleOutline size={15} className="text-primary-500 inline mr-1.5 shrink-0" />
              <span className="text-sm text-secondary-700 leading-relaxed">{answer?.text}</span>
            </div>
            {professionalName && (
              <div className="flex items-center gap-1.5 self-end">
                {professionalImage ? (
                  <img
                    src={professionalImage}
                    alt={professionalName}
                    className="size-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="size-5 rounded-full bg-primary-200 text-primary-800 text-[10px] font-bold flex items-center justify-center">
                    {professionalInitial}
                  </div>
                )}
                <p className="text-xs text-primary-700 font-medium flex items-center gap-1">
                  <BsPersonBadge size={12} className="text-primary-500" />
                  {professionalName}
                </p>
              </div>
            )}
          </div>
        ) : (
          <ResponseForm questionId={_id} user={user} creatorId={userId} />
        )}
      </div>

      {isAnswered && professional && (
        <ProfessionalInfo professional={professional} />
      )}
    </div>
  );
};

export default QuestionContent;
