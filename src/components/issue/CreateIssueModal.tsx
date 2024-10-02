import { useReducer, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { APIERROR, CreateIssue, CreateIssueFormData } from '../../api/apiTypes';
import { selectAuthUser } from '../../api/endpoints/auth.endpoint';
import { useCreateIssueMutation } from '../../api/endpoints/issues.endpoint';
import DropDown from '../util/DropDown';
import WithLabel from '../util/WithLabel';
import Item from '../util/Item';
import Model from '../util/Model';
import type { IssueModalProps } from './IssueModelHOC';
import TextInput from './TextInput';
import toast from 'react-hot-toast';

const CreateIssueModel = (props: IssueModalProps) => {
  const { lists, members, types, priorities, onClose } = props;
  const { authUser: u } = selectAuthUser();
  const [createIssue, { error, isLoading }] = useCreateIssueMutation();
  const [form, dispatch] = useReducer(reducer, initial);
  const [err, setErr] = useState('');
  const projectId = Number(useParams().projectId);

  if (!u) return null;

  // Redirect to login if unauthorized
  if (error && (error as APIERROR).status === 401) return <Navigate to='/login' />;

  const handleCreateIssue = async () => {
    // Validate form fields
    if (!form.summary) return setErr('Summary must not be empty.');
    if (form.summary.length > 100) return setErr('Summary must be less than 100 characters.');
    if (form.descr.length > 500) return setErr('Description must be less than 500 characters.');

    // Reset error if all fields are valid
    setErr('');

    const formData = new FormData();

    // Append form fields to FormData
    formData.append('type', String(form.type));
    formData.append('reporterId', String(u.id));
    formData.append('priority', String(form.priority));
    formData.append('summary', form.summary);
    formData.append('descr', form.descr);
    formData.append('projectId', String(projectId));

    // Append optional fields
    formData.append('assignees', JSON.stringify(form.assignees));
    if (form.listId) formData.append('listId', String(form.listId));
    if (form.attachment) {
      formData.append('attachment', form.attachment);
    }
    

    try {
      // Await create issue mutation
      // const urlEncoded = new URLSearchParams(formData as any).toString();
      // console.log(urlEncoded)

      await createIssue(formData);
      // Show success toast and close the modal
      toast('Created an issue!');
      onClose();
    } catch (err) {
      // Handle error and show user-friendly error message
      toast.error('Failed to create the issue. Please try again.');
    }
  };

  // Handle file change event for attachment
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    dispatch({ type: 'attachment', value: file });
  };

  return (
    <Model onSubmit={handleCreateIssue} {...{ onClose, isLoading }} className='max-w-[35rem]'>
      <>
        <span className='text-[22px] font-[600] text-c-1'>Create</span>
        <WithLabel label='Issue type'>
          <DropDown
            list={types}
            dispatch={dispatch}
            actionType='type'
            type='normal'
            className='w-full'
          />
        </WithLabel>

        <TextInput
          type='summary'
          label='Summary'
          dispatch={dispatch}
          value={form.summary}
          max={100}
        />
        {err && <span className='-mb-3 block text-sm text-red-400'>{err}</span>}
        <TextInput
          type='descr'
          label='Description'
          dispatch={dispatch}
          value={form.descr}
          max={500}
        />

        {/* Attachments Section */}
        <WithLabel label='Attachment'>
          <input
            type='file'
            onChange={handleFileChange}
            className='w-full border border-gray-300 rounded p-2'
          />
        </WithLabel>

        {members && (
          <>
            <WithLabel label='Reporter'>
              <div className='rounded-sm bg-[#f4f5f7] px-3 py-[5px]'>
                <Item
                  {...members.filter(({ value: v }) => v === u.id)[0]}
                  size='h-6 w-6'
                  variant='ROUND'
                />
              </div>
            </WithLabel>

            <WithLabel label='Assignee'>
              <DropDown
                list={members}
                dispatch={dispatch}
                actionType='assignee'
                type='multiple'
                className='w-full'
              />
            </WithLabel>
          </>
        )}

        <WithLabel label='Priority'>
          <DropDown
            list={priorities}
            dispatch={dispatch}
            actionType='priority'
            type='normal'
            className='w-full'
          />
        </WithLabel>

        {lists && (
          <WithLabel label='Status'>
            <DropDown
              list={lists}
              dispatch={dispatch}
              actionType='listId'
              type='normal'
              className='w-full'
            />
          </WithLabel>
        )}
      </>
    </Model>
  );
};

export default CreateIssueModel;


// Define all action types including attachments
export type T = 'type' | 'summary' | 'descr' | 'assignee' | 'priority' | 'listId' | 'attachment';

export type A = { type: T; value: number | number[] | string | File | null };

const initial: State = {
  descr: '',
  summary: '',
  priority: 0,
  type: 0,
  reporterId: null,
  assignees: [],
  listId: null,
  attachment: null, // New state field for a single attachment
};

type State = Omit<CreateIssue, 'projectId'> & { attachment: File | null };

const reducer = (state: State, { type, value }: A): State => {
  switch (type) {
    case 'type':
      return { ...state, type: value as number };
    case 'summary':
      return { ...state, summary: value as string };
    case 'descr':
      return { ...state, descr: value as string };
    case 'assignee':
      return { ...state, assignees: value as number[] };
    case 'priority':
      return { ...state, priority: value as number };
    case 'listId':
      return { ...state, listId: value as number };
    case 'attachment':
      return { ...state, attachment: value as File | null }; // Handle single file update
    default:
      return state;
  }
};
