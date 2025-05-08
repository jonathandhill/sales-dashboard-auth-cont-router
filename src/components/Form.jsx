import supabase from '../supabase-client';
import { useActionState } from 'react';
import { useAuth } from '../context/AuthContext';

function Form({ metrics }) {
  const { session } = useAuth();
  const accountType = session?.user?.user_metadata?.account_type;
  const email = session?.user?.email;

  let repName = '';
  if (accountType === 'rep' && email) {
    repName = email.split('@')[0];
    repName = repName.charAt(0).toUpperCase() + repName.slice(1);
  }

  const generateOptions = () => {
    return metrics.map((metric) => (
      <option key={metric.name} value={metric.name}>
        {metric.name}
      </option>
    ));
  };

  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const newDeal = {
        name: formData.get('name'),
        value: formData.get('value'),
      };
      console.log('newDeal', newDeal);

      const { error } = await supabase.from('sales_deals').insert(newDeal);

      if (error) {
        console.error('Error adding deal: ', error);
        return new Error('Failed to add deal'); // Return error state
      }
      return null; // Return success state
    },
    null // Initial state
  );

  return (
    <div className="add-form-container">
      <form
        action={submitAction}
        aria-label="Add new sales deal"
        aria-describedby="form-description"
      >
        <div id="form-description" className="sr-only">
          Use this form to add a new sales deal. Select a sales rep and enter
          the amount.
        </div>

        {accountType === 'rep' ? (
          <label htmlFor="deal-name">
            Name:
            <input
              id="deal-name"
              type="text"
              name="name"
              value={repName}
              readOnly
              className="rep-name-input"
            />
          </label>
        ) : (
          <label htmlFor="deal-name">
            Name:
            <select
              id="deal-name"
              name="name"
              defaultValue={metrics?.[0]?.name || ''}
              aria-required="true"
              aria-invalid={error ? 'true' : 'false'}
              disabled={isPending}
            >
              {generateOptions()}
            </select>
          </label>
        )}

        <label htmlFor="deal-value">
          Amount: $
          <input
            id="deal-value"
            type="number"
            name="value"
            defaultValue={0}
            className="amount-input"
            min="0"
            step="10"
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
            aria-label="Deal amount in dollars"
            disabled={isPending}
          />
        </label>

        <button
          className="add-deal-button"
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
        >
          {isPending ? 'Adding...' : 'Add Deal'}
        </button>
      </form>

      {error && (
        <div role="alert" className="error-message">
          {error.message}
        </div>
      )}
    </div>
  );
}

export default Form;
