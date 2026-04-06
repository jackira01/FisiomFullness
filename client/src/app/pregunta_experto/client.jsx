'use client';
import { Fragment, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useHydrateAtoms } from 'jotai/utils';
import { questionsAtom } from '@/components/pregunta_experto/store/questions';
import QuestionForm from '@/components/pregunta_experto/QuestionForm';
import QuestionFilters from '@/components/pregunta_experto/QuestionFilters';
import QuestionsContainer from '@/components/pregunta_experto/QuestionsContainer';
import Link from 'next/link';
import Loader from '@/components/Loader';

function PreguntaExpertoClient({ initialData }) {
  // * State to show the content only when all components are hydrated
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useHydrateAtoms([[questionsAtom, initialData]]);

  useEffect(() => {
    if (status !== 'loading') setLoading(false);
  }, [status]);

  if (loading) return <Loader />;

  return (
    <Fragment>
      {status === 'authenticated' ? (
        <QuestionForm />
      ) : (
        <div className="w-full px-5 py-4 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-2xl shadow-md text-center">
          <p className="text-base font-medium">
            <Link
              href="/login"
              className="underline underline-offset-2 font-bold hover:text-primary-50 transition-colors"
            >
              Inicia sesión
            </Link>{' '}
            para enviar una pregunta a nuestros expertos
          </p>
        </div>
      )}
      <QuestionFilters />
      <QuestionsContainer user={session?.user} />
    </Fragment>
  );
}

export default PreguntaExpertoClient;
