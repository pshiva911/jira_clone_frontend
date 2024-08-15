import { ChakraProvider, Modal, ModalContent, ModalOverlay, useToast } from '@chakra-ui/react';
import { Dispatch, FC, SetStateAction } from 'react';
import { useParams } from 'react-router-dom';
import { selectLists } from '../../api/lists.endpoint';
import { selectMembers } from '../../api/member.endpoint';
import { types, priorities } from '../../category';
import { Category } from '../util/DropDown';

export type IssueMetaData = { listIdx: number; listId: number; idx: number };

interface Props {
  isOpen: boolean;
  size?: 'responsive' | 'fixed';
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  render: FC<IssueModalProps>;
  issue?: IssueMetaData;
}

function IssueModalHOC(props: Props) {
  const projectId = Number(useParams().projectId);
  const { issue, size = 'responsive', isOpen, setIsOpen, render: Render } = props;
  const { members: apiMembers } = selectMembers(projectId);
  const { lists: apiLists } = selectLists(projectId);
  const toast = useToast();

  console.log(apiLists);

  if (apiLists && apiLists.length === 0) {
    toast({
      title: 'Please create a list before creating an issue',
      position: 'top-right',
      duration: 4000,
      isClosable: true,
    });
    setIsOpen(false);
    return <></>;
  }

  const members = apiMembers
    ? (apiMembers.map(({ username: u, profileUrl: p, userId }) => ({
        text: u,
        icon: p,
        value: userId,
      })) as Category[])
    : [];
  const lists = apiLists
    ? (apiLists.map(({ id, name }) => ({ text: name, value: id })) as Category[])
    : [];

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <ChakraProvider>
      <Modal isOpen={isOpen} onClose={handleClose} autoFocus={false} isCentered size='xl'>
        <ModalOverlay bgColor='#0d67cc40' />
        <ModalContent
          borderRadius={2}
          mx={8}
          {...(size === 'responsive' && { minW: 'min(80%, 60rem)' })}
        >
          <Render
            {...{
              projectId,
              lists,
              members,
              types,
              priorities,
              issue: issue as IssueMetaData,
              handleClose,
            }}
          />
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}

export default IssueModalHOC;

export type T = 'TYPE' | 'SUMMARY' | 'DESCR' | 'ASSIGNEE' | 'PRIORITY' | 'LISTID';

export interface IssueModalProps {
  projectId: number;
  issue?: IssueMetaData;
  members: Category[];
  lists: Category[];
  types: Category[];
  priorities: Category[];
  handleClose: () => void;
}
