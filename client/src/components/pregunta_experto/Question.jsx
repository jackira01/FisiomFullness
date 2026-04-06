import { useDisclosure } from '@nextui-org/react';
import DeleteTab from './DeleteTab';
import DeleteModal from './DeleteModal';
import QuestionContent from './QuestionContent';

function Question({ data, tabOpened, setQuestionTabId, canDelete, user }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const deleteBtnHeight = '2rem';

  const handleTab = () => {
    if (canDelete) setQuestionTabId((prev) => (prev === data._id ? null : data._id));
  };

  return (
    <div
      onClick={handleTab}
      className="relative bg-white border border-gray-100 py-4 px-5 rounded-2xl shadow-sm transition-all duration-200 ease-in-out hover:shadow-md hover:border-primary-200 hover:bg-primary-50/30"
      style={{
        marginTop: tabOpened ? deleteBtnHeight : 0,
        cursor: canDelete ? 'pointer' : 'default',
      }}
    >
      <DeleteTab
        showTab={tabOpened}
        openModal={onOpen}
        deleteBtnHeight={deleteBtnHeight}
      />
      <DeleteModal
        questionId={data._id}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
      <QuestionContent data={data} user={user} />
    </div>
  );
}

export default Question;
