import Form from 'next/form'
import SearchFormReset from '../components/SearchFormReset';
import { Search } from 'lucide-react';

const SearchForm = ({
  query,
  placeholder = 'Search our site!',
}: {
  query?: string;
  placeholder?: string;
}) => {
    
  return (
    <Form action="/" scroll={false} className="search-form"> 
        <input
            name="query"
            defaultValue={query}
            className="search-input"
            placeholder={placeholder}>
        </input>

        <div className='flex gap-2'>
            {query && <SearchFormReset/>}

            <button type="submit" className="search-btn text-white">
                <Search className='size-5' />
            </button>
        </div>
    </Form>
  )
}

export default SearchForm
