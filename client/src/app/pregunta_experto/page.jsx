import { getQuestions } from '../../services/questions';
import { apiEndpoints } from '../../api_endpoints';
import PreguntaExpertoClient from './client';

export const metadata = {
  title: 'Pregunta a un experto',
  description: 'Siéntete libre de hacer una pregunta de forma completamente anónima, y los profesionales de Fisiomfulness resolverán tus dudas a la brevedad.',
};

const LIMIT_QUESTIONS = 10;
const iniQuery = { limit: LIMIT_QUESTIONS };

const getSpecialties = async () => {
  try {
    const res = await fetch(apiEndpoints.specialties, {
      method: 'GET',
    });
    if (!res.ok) throw new Error('Error obteniendo especialidades');
    return await res.json();
  } catch (error) {
    console.error('Error fetching specialties:', error.message);
    return { results: [] };
  }
};

const PreguntaExpertoPage = async () => {
  const { questions, totalQuestions, hasMoreToLoad } = await getQuestions(iniQuery);
  const { results } = await getSpecialties();
  const initialData = {
    questions,
    specialties: results,
    totalQuestions,
    hasMoreToLoad,
    query: iniQuery,
  };

  return (
    <main className="p-4 pt-6 min-h-[92vh] w-full max-w-3xl flex flex-col items-center mx-auto gap-4 overflow-hidden">
      <PreguntaExpertoClient initialData={initialData} />
    </main>
  );
};

export default PreguntaExpertoPage;
